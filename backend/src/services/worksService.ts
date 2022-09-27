import WorkListResponse from '../types/WorkListResponse'
import workDatabaseService from '../database/services/worksDatabaseService'
import filesDatabaseService from '../database/services/filesDatabaseService'
import User from '../types/User'
import Work from '../types/Work'
import WorkPostBody from '../types/WorkPostBody'
import WorkResponse from '../types/WorkResponse'
import {deleteFile, saveFile, updateFileOrder} from './filesService'
import WorkUpdateBody, {ModifyWorkAddons} from '../types/WorkUpdateBody'
import FORM_MODIFiCATION_TYPE from '../enums/FORM_MODIFiCATION_TYPE'
import WorkListQuery from '../types/WorkListQuery'
import File from '../types/File'
import {begin, commit} from '../database/services/databaseService'
import {PoolClient} from 'pg'
import tagDatabaseService from '../database/services/tagDatabaseService'
import authorDatabaseService from '../database/services/authorDatabaseService'
import WorkQueryType from '../database/types/WorkQueryType'
import workExternalLinksDatabaseService from '../database/services/workExternalLinksDatabaseService'
import MODIFICATION_ORDER from '../enums/MODIFICATION_ORDER'

export async function findWork(title: string, user?: User): Promise<WorkResponse> {
	let work: Work

	if (user) {
		work = await workDatabaseService.findWorkWithTitle(title)
	} else {
		work = await workDatabaseService.findWorkPublicWithTitle(title)
	}

	const filesAndImages = await filesDatabaseService.findWithWorksId([work.id])

	const tags = (await tagDatabaseService.findWithWorkId(work.id))
		.map(tag => tag.name)

	const authors = (await authorDatabaseService.findWithWorkId(work.id))
		.map(author => author.name)

	const externalLinks = await workExternalLinksDatabaseService.findWithWorkId(work.id)

	function parseFile(file: File) {
		return {
			id: file.id,
			name: file.name + '.' + file.extension,
		}
	}

	delete work.createdAt
	delete work.updatedAt

	if (!user) delete work.active

	return {
		...work,
		subjectId: work.subjectId,
		externalLinks,
		tags,
		authors,
		files: filesAndImages.filter(f => f.type === 'PDF').map(parseFile),
		images: filesAndImages.filter(f => f.type === 'IMG').map(parseFile),
	}
}

export async function getWorks(user?: User, query?: WorkListQuery, client?: PoolClient): Promise<WorkListResponse[]> {
	let works: Work[]
	const dataBaseQuery: WorkQueryType = {
		q: query?.q,
		tags: query?.tags ? query.tags.split(',') : undefined,
		subjects: query?.subjects ? query.subjects.split(',') : undefined,
		authors: query?.authors ? query.authors.split(',') : undefined,
		active: query?.active ? query.active === 'true' : undefined,
	}

	if (user) {
		works = await workDatabaseService.allWorks(dataBaseQuery, client)
	} else {
		works = await workDatabaseService.allWorksPublic(dataBaseQuery, client)
	}

	const worksWithVideoImagesIds = works.filter(w => w.isVideoPreviewImage)
		.map(w => w.id)

	const externalLinks = await workExternalLinksDatabaseService.findVideosWithWorkIds(worksWithVideoImagesIds)
	const externalLinksWorkIds = externalLinks.map(l => l.workId)

	const workIds = works.filter(w => !externalLinksWorkIds.includes(w.id))
		.map(p => p.id)

	const images = (await filesDatabaseService.findWithWorksId(workIds))
		.filter(f => f.type === 'IMG')
		.map(f => ({ id: f.workId, name: f.name + '.' + f.extension} ))

	return works.map(p => {
		const [, videoId] = externalLinks.find(i => i.id === p.id)
			?.link
			?.match('v=(.*?)($|&)') || []

		const image = `https://img.youtube.com/vi/${videoId}/0.jpg`

		const data: WorkListResponse = {
			id: p.id,
			title: p.title,
			subjectId: p.subjectId,
			image: videoId ? image : images?.find(i => i.id === p.id)?.name,
		}
		if (user) data.active = p.active

		return data
	})
}

export async function getPreviewWorks(): Promise<Record<number, WorkListResponse[]>> {
	const works = await workDatabaseService.allWorksPublic()

	const worksWithVideoImagesIds = works.filter(w => w.isVideoPreviewImage)
		.map(w => w.id)

	const externalLinks = await workExternalLinksDatabaseService.findVideosWithWorkIds(worksWithVideoImagesIds)
	const externalLinksWorkIds = externalLinks.map(l => l.workId)

	const workIds = works.filter(w => !externalLinksWorkIds.includes(w.id))
		.map(p => p.id)

	const images = (await filesDatabaseService.findWithWorksId(workIds))
		.filter(f => f.type === 'IMG')
		.map(f => ({ id: f.workId, name: f.name + '.' + f.extension} ))

	const subjects = works.map(p => p.subjectId)
		.filter((s, i, a) => a.indexOf(s) === i)

	const res: Record<number, WorkListResponse[]> = {}
	for (const subjectId of subjects) {
		res[subjectId] = works
			.filter(p => p.subjectId === subjectId)
			.map(p => {
				const [, videoId] = externalLinks.find(i => i.workId === p.id)
					?.link
					?.match('v=(.*?)($|&)') || []

				const image = `https://img.youtube.com/vi/${videoId}/0.jpg`

				return {
					id: p.id,
					title: p.title,
					subjectId: p.subjectId,
					image: videoId ? image : images.find(i => i.id === p.id).name,
				}
			})
	}

	return res
}

export async function deleteWork(id: number): Promise<void> {
	await workDatabaseService.deleteWork(id)
}

export async function addWork(work: WorkPostBody): Promise<void> {
	const client = await begin()

	const newWork = await workDatabaseService.saveWork({ ...work, title: work.title.trim() }, client)

	await Promise.all(work.tags.map(tag => tagDatabaseService.saveTag(tag, newWork.id, client)))

	await Promise.all(work.authors.map(author => authorDatabaseService.saveAuthor(author, newWork.id, client)))

	await Promise.all(work.externalLinks.map(link => workExternalLinksDatabaseService.saveWorkExternalLink(newWork.id, link, client)))

	await Promise.all(work.files.map(async (f, i) => {
		await saveFile(f.name, f.contents, {id: newWork.id, order: i}, client)
	}))

	await Promise.all(work.images.map(async (f, i) => {
		await saveFile(f.name, f.contents, {id: newWork.id, order: i}, client)
	}))

	await commit(client)
}

export async function updateWork(id: number, work: WorkUpdateBody): Promise<void> {
	const client = await begin()

	if (work.title) work = { ...work, title: work.title.trim() }

	try {
		await workDatabaseService.updateWork(id, work, client)
	} catch (e) {
		if (e.message !== 'NO_FIELDS_TO_UPDATE') throw e
	}

	function modificationOrder(a: ModifyWorkAddons<unknown, unknown>, b: ModifyWorkAddons<unknown, unknown>): number {
		return MODIFICATION_ORDER[a.modificationType] - MODIFICATION_ORDER[b.modificationType]
	}

	if (work.tags) for (const tag of work.tags.sort(modificationOrder as never)) {
		switch (tag.modificationType) {
		case (FORM_MODIFiCATION_TYPE.DELETE):
			await tagDatabaseService.removeTagFromWork(tag.name, id, client)
			break
		case (FORM_MODIFiCATION_TYPE.NEW):
			await tagDatabaseService.saveTag(tag.name, id, client)
			break
		}
	}

	if (work.authors) for (const author of work.authors.sort(modificationOrder as never)) {
		switch (author.modificationType) {
		case (FORM_MODIFiCATION_TYPE.DELETE):
			await authorDatabaseService.removeAuthorFromWork(author.name, id, client)
			break
		case (FORM_MODIFiCATION_TYPE.NEW):
			await authorDatabaseService.saveAuthor(author.name, id, client)
			break
		}
	}

	if (work.files) for (const file of work.files.sort(modificationOrder)) {
		if (file.modificationType === FORM_MODIFiCATION_TYPE.DELETE) {
			await deleteFile(file.id, client)
		}
		else if (file.modificationType === FORM_MODIFiCATION_TYPE.UPDATE) {
			await updateFileOrder(file.id, file.order, client)
		}
		else if (file.modificationType === FORM_MODIFiCATION_TYPE.NEW) {
			await saveFile(file.name, file.contents, {id, order: file.order}, client)
		}
	}

	if (work.images) for (const image of work.images.sort(modificationOrder)) {
		if (image.modificationType === FORM_MODIFiCATION_TYPE.DELETE) {
			await deleteFile(image.id, client)
		}
		else if (image.modificationType === FORM_MODIFiCATION_TYPE.UPDATE) {
			await updateFileOrder(image.id, image.order, client)
		}
		else if (image.modificationType === FORM_MODIFiCATION_TYPE.NEW) {
			await saveFile(image.name, image.contents, {id, order: image.order}, client)
		}
	}

	if (work.externalLinks) for (const link of work.externalLinks.sort(modificationOrder)) {
		if (link.modificationType === FORM_MODIFiCATION_TYPE.DELETE) {
			await workExternalLinksDatabaseService.deleteWorkExternalLink(link.id, client)
		}
		else if (link.modificationType === FORM_MODIFiCATION_TYPE.UPDATE || link.modificationType === FORM_MODIFiCATION_TYPE.NEW) {

			await workExternalLinksDatabaseService.saveWorkExternalLink(id, link, client)
		}
	}

	await commit(client)
}
