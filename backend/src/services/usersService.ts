import UsersPostBody from '../types/UsersPostBody'
import bcrypt from 'bcrypt'
import usersDatabaseService from '../database/services/usersDatabaseService'
import User from '../types/User'
import UserListResponse from '../types/UserListResponse'
import UserResponse from '../types/UserResponse'
import HttpErrorNotFound from '../errors/HttpErrorNotFound'
import HttpErrorBadRequest from '../errors/HttpErrorBadRequest'
import {PoolClient} from 'pg'

export async function getUsers(): Promise<UserListResponse[]> {
	const users = await usersDatabaseService.allUsers()

	return users.map(user => ({
		id: user.id,
		name: user.name
	}))
}

export async function getUser(id: number): Promise<UserResponse> {
	const user = await usersDatabaseService.getUser(id)

	if (!user) throw new HttpErrorNotFound('USER_NOT_FOUND')

	return {
		id: user.id,
		name: user.name,
		email: user.email
	}
}

export async function addUser(newUser: UsersPostBody, client?: PoolClient): Promise<User> {
	if (!newUser.password) throw new HttpErrorBadRequest('PASSWORD_IS_REQUIRED')

	return await usersDatabaseService.saveUser({
		...newUser,
		password: await bcrypt.hash(newUser.password, parseInt(process.env.SALT_ROUNDS))
	}, client)
}

export async function updateUser(id: number, user: UsersPostBody): Promise<void> {
	if (user.password) user.password = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS))
	await usersDatabaseService.updateUser(id, user)
}

export async function deleteUser(id: number, user?: User): Promise<void> {
	if (user?.id == id) throw new HttpErrorBadRequest('USER_CANNOT_DELETE_HIMSELF')

	await usersDatabaseService.deleteUser(id)
}
