import WorkFormsControlsCollections from '../types/WorkFormsControlsCollections'
import {WorkNonFormData} from '../../../sdk.riiul-api/works/models/Work'
import {WorkFileNewForm, WorkNewForm} from '../../../sdk.riiul-api/works/types/WorkNewForm'
import WORK_EXTERNAL_LINK from '../../../sdk.riiul-api/works/enums/WORK_EXTERNAL_LINK'

async function htmlFormToWorkNewForm(elements: WorkFormsControlsCollections, nonFormData: WorkNonFormData): Promise<WorkNewForm> {
	const { title, subject, description, priority, active, externalLink, externalLinkName, youtubeLink, isVideoPreviewImage, youtubeLinkName} = elements
	const { graduationYear, tags, authors, files, images } = nonFormData

	const newImages: WorkFileNewForm[] = []

	for (const image of images) {
		newImages.push({
			name: image.name,
			contents: await image.fileContent()
		})
	}

	const newFiles: WorkFileNewForm[] = []

	for (const file of files) {
		newFiles.push({
			name: file.name,
			contents: await file.fileContent()
		})
	}

	const externalLinks = []

	if (externalLink.value || externalLinkName.value) {
		externalLinks.push(
			{
				title: externalLinkName.value,
				link: externalLink.value, type:
				WORK_EXTERNAL_LINK.EXTERNAL
			}
		)
	}

	if (youtubeLink.value) {
		externalLinks.push(
			{
				title: youtubeLinkName.value,
				link: youtubeLink.value, type:
				WORK_EXTERNAL_LINK.YOUTUBE
			}
		)
	}

	return {
		title: title.value,
		subjectId: parseInt(subject.value),
		description: description.value,
		priority: priority.checked,
		active: active.checked,
		externalLinks,
		authors,
		tags,
		graduationYear: graduationYear || undefined,
		images: newImages,
		files: newFiles,
		isVideoPreviewImage: isVideoPreviewImage.checked
	}
}

export default htmlFormToWorkNewForm
