import WorkListResponse from '../types/WorkListResponse'
import WorkPostBody from '../types/WorkPostBody'
import WorkResponse from '../types/WorkResponse'
import {deleteFile, saveFile, updateFileOrder} from './filesService'
import WorkUpdateBody, {ModifyWorkAddons} from '../types/WorkUpdateBody'
import FORM_MODIFiCATION_TYPE from '../enums/FORM_MODIFiCATION_TYPE'
import WorkListQuery from '../types/WorkListQuery'
import {
	authorsRepository,
	worksRepository,
	workExternalLinksRepository,
	filesRepository,
	tagsRepository,
	begin,
	commit,
	File,
	User,
	Work
} from '@riiul/repository'
import {PoolClient} from 'pg'
import MODIFICATION_ORDER from '../enums/MODIFICATION_ORDER'

export async function findWork(title: string, user?: User): Promise<WorkResponse> {
	let work: Work

	if (user) {
		work = await worksRepository.findWorkWithTitle(title)
	} else {
		work = await worksRepository.findPublicWorkWithTitle(title)
	}

	const filesAndImages = await filesRepository.findFilesWithWorkId([work.id])

	const tags = (await tagsRepository.findTagsWithWorkId(work.id))
		.map(tag => tag.name)

	const authors = (await authorsRepository.findAuthorWithWorkId(work.id))
		.map(author => author.name)

	const externalLinks = await workExternalLinksRepository.findWorkExternalLinksWithWorkId(work.id)

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
	const dataBaseQuery = {
		q: query?.q,
		tags: query?.tags ? query.tags.split(',') : undefined,
		subjects: query?.subjects ? query.subjects.split(',') : undefined,
		authors: query?.authors ? query.authors.split(',') : undefined,
		active: user ? (query?.active ? query.active === 'true' : undefined) : true
	}

	const works = await worksRepository.findWorks(dataBaseQuery, client)

	const worksWithVideoImagesIds = works.filter(w => w.isVideoPreviewImage)
		.map(w => w.id)

	const externalLinks = await workExternalLinksRepository.findVideosWithWorkIds(worksWithVideoImagesIds)
	const externalLinksWorkIds = externalLinks.map(l => l.workId)

	const workIds = works.filter(w => !externalLinksWorkIds.includes(w.id))
		.map(p => p.id)

	const images = (await filesRepository.findFilesWithWorkId(workIds))
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
	const works = await worksRepository.findWorks({ active: true })

	const worksWithVideoImagesIds = works.filter(w => w.isVideoPreviewImage)
		.map(w => w.id)

	const externalLinks = await workExternalLinksRepository.findVideosWithWorkIds(worksWithVideoImagesIds)
	const externalLinksWorkIds = externalLinks.map(l => l.workId)

	const workIds = works.filter(w => !externalLinksWorkIds.includes(w.id))
		.map(p => p.id)

	const images = (await filesRepository.findFilesWithWorkId(workIds))
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
	await worksRepository.deleteWork(id)
}

export async function addWork(work: WorkPostBody): Promise<void> {
	const client = await begin()

	const newWork = await worksRepository.saveWork({ ...work, title: work.title.trim() }, client)

	await Promise.all(work.tags.map(tag => tagsRepository.saveTag(tag, newWork.id, client)))

	await Promise.all(work.authors.map(author => authorsRepository.saveAuthor(author, newWork.id, client)))

	await Promise.all(work.externalLinks.map(link => workExternalLinksRepository.saveWorkExternalLink(newWork.id, link, client)))

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
		await worksRepository.updateWork(id, work as unknown as Work, client)
	} catch (e) {
		if (e.message !== 'NO_FIELDS_TO_UPDATE') throw e
	}

	function modificationOrder(a: ModifyWorkAddons<unknown, unknown>, b: ModifyWorkAddons<unknown, unknown>): number {
		return MODIFICATION_ORDER[a.modificationType] - MODIFICATION_ORDER[b.modificationType]
	}

	if (work.tags) for (const tag of work.tags.sort(modificationOrder as never)) {
		switch (tag.modificationType) {
		case (FORM_MODIFiCATION_TYPE.DELETE):
			await tagsRepository.removeTagFromWork(tag.name, id, client)
			break
		case (FORM_MODIFiCATION_TYPE.NEW):
			await tagsRepository.saveTag(tag.name, id, client)
			break
		}
	}

	if (work.authors) for (const author of work.authors.sort(modificationOrder as never)) {
		switch (author.modificationType) {
		case (FORM_MODIFiCATION_TYPE.DELETE):
			await authorsRepository.removeAuthorFromWork(author.name, id, client)
			break
		case (FORM_MODIFiCATION_TYPE.NEW):
			await authorsRepository.saveAuthor(author.name, id, client)
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
			await workExternalLinksRepository.deleteWorkExternalLink(link.id, client)
		}
		else if (link.modificationType === FORM_MODIFiCATION_TYPE.UPDATE || link.modificationType === FORM_MODIFiCATION_TYPE.NEW) {

			await workExternalLinksRepository.saveWorkExternalLink(id, link, client)
		}
	}

	await commit(client)
}
