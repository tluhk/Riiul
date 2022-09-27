import {DateTime} from 'luxon'

type User = {
	id: number
	name: string
	email: string
	password: string
	createdAt: DateTime
	updatedAt: DateTime
}

export default User
