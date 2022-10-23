import {DateTime} from 'luxon'

export interface Subject {
	id: number
	name: string
	active: boolean
	createdAt: DateTime
	updatedAt: DateTime
}
