import UserDatabaseType from '../types/UserDatabaseType'
import User from '../../types/User'
import {DateTime} from 'luxon'

function userMapper(databaseUser?: UserDatabaseType): User | null {
	if (!databaseUser) return null

	const user = { ...databaseUser }
	delete user.created_at
	delete user.updated_at

	return {
		...user,
		createdAt: DateTime.fromJSDate(databaseUser.created_at),
		updatedAt: DateTime.fromJSDate(databaseUser.updated_at)
	}
}

export default userMapper
