import { query } from '../../../src/database/services/databaseService'
import usersDatabaseService, {findUserWithEmail, saveUser, updateUser} from '../../../src/database/services/usersDatabaseService'
import faker from 'faker'
import UserDatabaseType from '../../../src/database/types/UserDatabaseType'
import UsersPostBody from '../../../src/types/UsersPostBody'

describe('allUsers', () => {
	it('should return all users', async () => {
		const res = await usersDatabaseService.allUsers()

		expect(res).not.toBeNull()
	})
})

describe('getUser', () => {
	const data = [faker.name.firstName(), faker.internet.email(), faker.internet.password()]
	let id: number

	beforeEach(async () => {
		const res = await query<UserDatabaseType>('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', data)
		id = res.rows[0].id
	})

	afterEach(async () => {
		await query('DELETE FROM users WHERE email = $1', [data[1]])
	})

	it('should return a user', async () => {
		const res = await  usersDatabaseService.getUser(id)

		expect(res.id).toBe(id)
		expect(res.name).toBe(data[0])
		expect(res.email).toBe(data[1])
		expect(res.password).toBe(data[2])
	})

	it('should return null', async () => {
		const res = await  usersDatabaseService.getUser(-1)

		expect(res).toBeNull()
	})

	it('should throw not found error if user isn\'t found', async () => {
		await expect(usersDatabaseService.findUserWithId(id + 1))
			.rejects
			.toThrow('USER_NOT_FOUND')
	})
})

describe('findUserWithEmail', () => {
	const data = ['USER_SERVICE_TEST_NAME', 'USER_SERVICE_TEST_EMAIL', 'TEST_PASSWORD']
	beforeAll(async () => {
		await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', data)
	})

	afterAll(async () => {
		await query('DELETE FROM users WHERE name = $1 AND email = $2 AND password = $3', data)
	})

	it('should return a user', async () => {
		const res = await findUserWithEmail(data[1])

		expect(res).not.toBeNull()
		expect(res).toMatchObject({
			name: data[0],
			email: data[1],
			password: data[2]
		})
	})

	it('should return undefined', async () => {
		expect(await findUserWithEmail('THIS DOES NOT EXIST')).toBeNull()
	})
})

describe('saveUser', () => {
	const uniqueKey = 'USERS_SERVICE_SAVE_USER_'
	const user = {
		name: uniqueKey + 'NAME',
		email: uniqueKey + 'EMAIL',
		password: uniqueKey + 'PASSWORD'
	}

	it('should return a newly created user', async () => {
		const res = await saveUser(user)

		expect(res).not.toBeNull()

		expect(res.name).toBe(user.name)
		expect(res.password).toBe(user.password)
		expect(res.email).toBe(user.email)

		expect(res.id).not.toBeNull()
		expect(res.createdAt).not.toBeNull()
		expect(res.updatedAt).not.toBeNull()

		await query('DELETE FROM users WHERE id = $1', [res.id])
	})
})

describe('updateUser', () => {
	const data = [faker.name.firstName(), 'USER_DATABASE_SERVICE_UNIQUE_EMAIL_1', faker.internet.password()]
	let id: number

	beforeEach(async () => {
		const res = await query<UserDatabaseType>('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', data)
		id = res.rows[0].id
	})

	afterEach(async () => {
		await query('DELETE FROM users WHERE email = $1', [data[1]])
	})

	test.each`
	field | value
	${'name'} | ${{ name: 'new user' }}
	${'name" and "password'} | ${{ name: 'new user', password: 'new password' }}
	${'name" and not update "id'} | ${{ name: 'new user', id: 9999 }}
	`('should updated database fields "$fields"', async ({ value }) => {
		const res = await updateUser(id, value)

		expect(res.updatedAt.toISO()).not.toBe(res.createdAt.toISO())
		expect(res.name).toBe(value.name)
		expect(res.password).toBe(value.password || data[2])
		expect(res.id).toBe(id)
	})

	it('should throw not found error if user isn\'t found', async () => {
		await expect(usersDatabaseService.updateUser(id + 1, {name: 'new name'} as UsersPostBody))
			.rejects
			.toThrow('USER_NOT_FOUND')
	})
})

describe('deleteUser', () => {
	let id: number

	beforeEach(async () => {
		const res = await query<UserDatabaseType>('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
			[faker.name.firstName(), faker.internet.email(), faker.internet.password()])
		id = res.rows[0].id
	})

	afterEach(async () => {
		await query('DELETE FROM users WHERE id = $1', [id])
	})

	it('should delete the user', async () => {
		await expect(usersDatabaseService.deleteUser(id)).resolves
	})

	it('should throw not found error if user isn\'t found', async () => {
		await expect(usersDatabaseService.deleteUser(0))
			.rejects
			.toThrow('USER_NOT_FOUND')
	})
})
