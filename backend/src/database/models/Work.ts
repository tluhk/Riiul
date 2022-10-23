import {DateTime} from 'luxon'

export interface Work {
	id: number
	subjectId: number
	title: string
	description: string
	tags?: string[]
	authors?: string[]
	priority: boolean
	active: boolean
	createdAt: DateTime
	updatedAt: DateTime
	graduationYear?: number
	isVideoPreviewImage: boolean
}
