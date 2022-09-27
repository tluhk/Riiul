import WorkExternalLinkSave from './WorkExternalLinkSave'

export type Files = {
	name: string
	contents: string
}

type WorkPostBody = {
	subjectId: number
	title: string
	description: string
	tags: string[],
	authors: string[],
	priority: boolean,
	active: boolean,
	graduationYear?: number,
	externalLinks: WorkExternalLinkSave[],
	images: Files[]
	files?: Files[],
	isVideoPreviewImage: boolean
}

export default WorkPostBody
