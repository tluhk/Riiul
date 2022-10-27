import {WorkExternalLink} from "@riiul/repository"

type WorkResponse = {
	id: number
	title: string
	description: string
	subjectId: number
	tags: string[]
	authors: string[]
	priority: boolean
	active: boolean
	externalLinks: WorkExternalLink[]
	images: string[] | {id: number, name: string}[]
	files: string[] | {id: number, name: string}[]
	isVideoPreviewImage: boolean
}

export default  WorkResponse
