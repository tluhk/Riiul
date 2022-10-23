import {DateTime} from 'luxon'

export interface User {
	id: number
	name: string
	email: string
	password: string
	createdAt: DateTime
	updatedAt: DateTime
}
