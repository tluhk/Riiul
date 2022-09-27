import WorkFormsControlsCollections from '../types/WorkFormsControlsCollections'
import Work, {WorkNonFormData} from '../../../sdk.riiul-api/works/models/Work'
import {
	WorkExternalLinkUpdateForm, WorkFileUpdateForm,
	WorkKeywordUpdateForm,
	WorkUpdateForm
} from '../../../sdk.riiul-api/works/types/WorkUpdateForm'
import {FORM_MODIFICATION_TYPE} from '../../../sdk.riiul-api/common/enums/FORM_MODIFICATION_TYPE'
import WorkExternalLink from '../../../sdk.riiul-api/works/models/WorkExternalLink'
import WorkFile from '../../../sdk.riiul-api/works/models/WorkFile'
import WORK_EXTERNAL_LINK from '../../../sdk.riiul-api/works/enums/WORK_EXTERNAL_LINK'

function toKeywordsUpdateForm(newKeywords: string[], oldKeywords: string[]) {
	const updateForm: WorkKeywordUpdateForm[] = []

	for (const keyword of newKeywords) {
		if (!oldKeywords.includes(keyword)) {
			updateForm.push({
				name: keyword,
				modificationType: FORM_MODIFICATION_TYPE.NEW
			})
		}
	}

	for(const keyword of oldKeywords) {
		if (!newKeywords.includes(keyword)) {
			updateForm.push({
				name: keyword,
				modificationType: FORM_MODIFICATION_TYPE.DELETE
			})
		}
	}

	return updateForm
}

type newExternalLinkType = {
	title: string
	link: string
	type: WORK_EXTERNAL_LINK
}

function toExternalLinksForm(newExternalLinks: newExternalLinkType[] ,oldExternalLinks: WorkExternalLink[]): WorkExternalLinkUpdateForm[] {
	const updateForm: WorkExternalLinkUpdateForm[] = []

	for (const externalLink of newExternalLinks) {
		const old = oldExternalLinks.find(oldLink => oldLink.type === externalLink.type)

		if (old) {
			updateForm.push({
				title: externalLink.title,
				link: externalLink.link,
				type: externalLink.type,
				id: old.id,
				modificationType: FORM_MODIFICATION_TYPE.UPDATE
			})
		} else {
			updateForm.push({
				title: externalLink.title,
				link: externalLink.link,
				type: externalLink.type,
				modificationType: FORM_MODIFICATION_TYPE.NEW
			})
		}
	}

	for (const oldExternalLink of oldExternalLinks) {
		if (!newExternalLinks.find(newLink => newLink.type === oldExternalLink.type)) {
			updateForm.push({
				id: oldExternalLink.id,
				modificationType: FORM_MODIFICATION_TYPE.DELETE
			})
		}
	}

	return updateForm
}

async function toWorkFileUpdateForm(newWorkFiles: WorkFile[], oldWorkFile: WorkFile[]): Promise<WorkFileUpdateForm[]> {
	const updateForm: WorkFileUpdateForm[] = []

	for (let i = 0; i < newWorkFiles.length; i++) {
		const file = newWorkFiles[i]
		const oldFile = oldWorkFile.find(oldFile => oldFile.id === file.id)

		if (file && oldFile) {
			if (file.id !== oldWorkFile[i].id) {
				updateForm.push({
					id: file.id,
					order: i,
					modificationType: FORM_MODIFICATION_TYPE.UPDATE
				})
			}
		} else if (file && !oldFile) {
			updateForm.push({
				name: file.name,
				contents: await file.fileContent(),
				order: i,
				modificationType: FORM_MODIFICATION_TYPE.NEW
			})
		} else throw new Error('Work file id mismatch')
	}

	for (const file of oldWorkFile) {
		if (!newWorkFiles.find(newFile => newFile.id === file.id)) {
			updateForm.push({
				id: file.id,
				modificationType: FORM_MODIFICATION_TYPE.DELETE
			})
		}
	}

	return updateForm
}

async function htmlFormToWorkUpdateForm(work: Work, elements: WorkFormsControlsCollections, nonFormData: WorkNonFormData): Promise<WorkUpdateForm> {
	const { title, subject, description, priority, active, externalLink, externalLinkName, youtubeLink, youtubeLinkName, isVideoPreviewImage} = elements
	const { graduationYear, tags, authors, files, images } = nonFormData

	const externalLinks = []
	if (externalLinkName.value || externalLink.value)
		externalLinks.push({ title: externalLinkName.value, link: externalLink.value, type: WORK_EXTERNAL_LINK.EXTERNAL })
	if (youtubeLink.value)
		externalLinks.push({ title: youtubeLinkName.value, link: youtubeLink.value, type: WORK_EXTERNAL_LINK.YOUTUBE })

	const formData: WorkUpdateForm = {
	}

	const modifiedAuthors = toKeywordsUpdateForm(authors, work.authors)
	if (modifiedAuthors.length > 0) formData.authors = modifiedAuthors

	const modifiedTags = toKeywordsUpdateForm(tags, work.tags)
	if (modifiedTags.length > 0) formData.tags = modifiedTags

	const modifiedExternalLinks = toExternalLinksForm(externalLinks, work.externalLinks)
	if (modifiedExternalLinks.length > 0) formData.externalLinks = modifiedExternalLinks

	const modifiedImages = await toWorkFileUpdateForm(images, work.images)
	if (modifiedImages.length > 0) formData.images = modifiedImages

	const modifiedFiles = await toWorkFileUpdateForm(files, work.files)
	if (modifiedFiles.length > 0) formData.files = modifiedFiles

	if (work.subjectId !== parseInt(subject.value)) formData.subjectId = parseInt(subject.value)
	if (work.title !== title.value) formData.title = title.value
	if (work.description !== description.value) formData.description = description.value
	if (work.priority !== priority.checked) formData.priority = priority.checked
	if (work.active !== null && work.active !== active.checked) formData.active = active.checked
	if (work.graduationYear !== graduationYear) formData.graduationYear = graduationYear || null
	if (work.isVideoPreviewImage !== isVideoPreviewImage.checked) formData.isVideoPreviewImage = isVideoPreviewImage.checked

	return formData
}

export default htmlFormToWorkUpdateForm
