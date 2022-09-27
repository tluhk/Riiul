import {DateTime} from 'luxon'

type Subject = {
	id: number
	name: string
	active: boolean
	createdAt: DateTime
	updatedAt: DateTime
}

export default Subject
