import {addUser, deleteUser} from '../../src/services/usersService'
import * as faker from 'faker'
import {begin, query, rollback} from '../../src/database/services/databaseService'
import {PoolClient} from 'pg'
import User from '../../src/types/User'

describe('addUser', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterAll(async () => {
		await rollback(client)
	})

	it('should return the new user', async () => {
		const userData = {
			email: faker.internet.email(),
			name: faker.name.firstName(),
			password: faker.internet.password()
		}

		const res = await addUser(userData)

		expect(res).not.toBeNull()

		expect(res.id).not.toBeNull()
		expect(res.createdAt).not.toBeNull()
		expect(res.updatedAt).not.toBeNull()
		expect(res.password).not.toBeNull()

		expect(res).toStrictEqual({
			id: res.id,
			createdAt: res.createdAt,
			updatedAt: res.updatedAt,
			password: res.password,
			email: userData.email,
			name: userData.name
		})

		await query('DELETE FROM users WHERE id = $1', [res.id])
	})

	test.each`
	missingKey
	${'name'}
	${'email'}
	${'password'}
	`('It should throw error when "$missingKey" is missing', async ({ missingKey }) => {
		const userData = {
			email: faker.internet.email(),
			name: faker.name.firstName(),
			password: faker.internet.password()
		}

		const data = { ...userData }

		if (missingKey === 'name') delete data.name
		if (missingKey === 'email') delete data.email
		if (missingKey === 'password') delete data.password

		await expect(addUser(data)).rejects.toMatchObject({
			status: 400
		})
	})

	it('should throw error when trying to add user with existing email', async () => {
		const userData = {
			email: faker.internet.email(),
			name: faker.name.firstName(),
			password: faker.internet.password()
		}
		await addUser(userData, client)

		const newUserData = {
			email: userData.email,
			name: faker.name.firstName(),
			password: faker.internet.password()
		}

		await expect(addUser(newUserData, client)).rejects.toMatchObject({
			status: 400
		})
	})
})

describe('deleteUser', () => {
	it('should throw 401 error when trying to delete current user', async () => {
		await expect(deleteUser(0, { id: 0} as User)).rejects.toMatchObject({
			status: 400,
			message: 'USER_CANNOT_DELETE_HIMSELF'
		})
	})
})
