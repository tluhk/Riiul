import {del, get, post, put} from '../common/request'
import User from './models/User'
import UserResponse from './types/UserResponse'
import UserUpdateForm from './types/UserUpdateForm'
import UserNewForm from './types/UserNewForm'

async function find(id: number): Promise<User> {
	const res = await get<UserResponse>(`/users/${id}`, true)

	return User.fromResponse(res.body)

}

async function getAll(): Promise<User[]> {
	const res = await get<UserResponse[]>('/users', true)

	return res.body.map(User.fromResponse)
}

async function update(id: number, body: UserUpdateForm): Promise<void> {
	await put<undefined>(`/users/${id}`, body, true)
}

async function add(body: UserNewForm): Promise<void> {
	await post<undefined>('/users', body, true)
}

async function remove(id: number): Promise<void> {
	await del<undefined>(`/users/${id}`, true)
}

export default {
	add,
	find,
	getAll,
	update,
	remove
}
