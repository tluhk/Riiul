import WORK_EXTERNAL_LINK from '../enums/WORK_EXTERNAL_LINK'

export type WorkResponseExternalLink = {
	id: number,
	title: string,
	link: string,
	type: WORK_EXTERNAL_LINK
}

export type WorkResponseFile = {
	id: number,
	name: string
}

export type WorkResponse = {
	id: number
	subjectId: number
	title: string
	description: string
	priority: boolean
	active?: boolean
	graduationYear?: number
	externalLinks: WorkResponseExternalLink[]
	authors: string[]
	tags: string[]
	images: WorkResponseFile[]
	files: WorkResponseFile[]
	isVideoPreviewImage: boolean
}
