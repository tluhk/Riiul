import WORK_EXTERNAL_LINK from '../enums/WORK_EXTERNAL_LINK'

export type WorkFileNewForm = {
	name: string
	contents: string
	order?: number
}

export type WorkExternalLinkNewForm = {
	title: string
	link: string
	type: WORK_EXTERNAL_LINK
}

export type WorkNewForm = {
	subjectId: number
	title: string
	description: string | null
	tags: string[]
	authors: string[]
	priority: boolean
	active: boolean
	videoLink?: string | null
	graduationYear?: number
	externalLinks: WorkExternalLinkNewForm[]
	images: WorkFileNewForm[]
	files: WorkFileNewForm[]
	isVideoPreviewImage: boolean
}
