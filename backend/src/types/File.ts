import {DateTime} from 'luxon'

type File = {
	id: number
	name: string
	extension: string
	originalName: string
	workOrder: number
	workId: number
	type: string
	createdAt: DateTime
	updatedAt: DateTime
}

export default File
