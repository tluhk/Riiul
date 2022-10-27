import {begin, rollback} from './shared'
import {PoolClient} from "pg"
import {
	deleteUser,
	findUser,
	findUserWithEmail,
	getUsers,
	saveUser,
	updateUser
} from "./usersRepository"
import {User} from "./models"
import {DateTime} from "luxon"

const BASE_USER_ID = 1
const BASE_USER_EMAIL = 'default.user@tlu.ee'
const BASE_USER_NAME = 'default user'

describe('usersRepository', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterEach(async () => {
		await rollback(client)
	})

	describe('findUser', () => {
		it('should find the user', async () => {
			const res = await findUser(1)

			expectUserToMatchBase(res)
		})

		it('should return undefined when user does not exist', async () => {
			expect(await findUser(-1)).toBeUndefined()
		})
	})

	describe('getUsers', () => {
		it('should return all users', async () => {
			const res = await getUsers()

			expect(res.length).toEqual(1)
		})
	})

	describe('findUserWithEmail', () => {
		it('should return a user', async () => {
			const res = await findUserWithEmail("default.user@tlu.ee")

			expectUserToMatchBase(res)
		})

		it('should return undefined when user does not exist', async () => {
			expect(await findUserWithEmail('THIS DOES NOT EXIST')).toBeUndefined()
		})
	})

	describe('saveUser', () => {
		const user = {
			name: 'user_name',
			email: 'user_email',
			password: 'user_password'
		}

		it('should save and return a newly created user', async () => {
			const saveRes = await saveUser(user, client)

			expectUserToMatch(saveRes, saveRes.id, user.email, user.name)

			const findRes = await findUser(saveRes.id, client)
			expect(findRes).toMatchObject(saveRes)
		})

		it('should throw error when email already exists', async () => {
			user.email = BASE_USER_EMAIL
			await expect(saveUser(user, client)).rejects.toThrow("EMAIL_ALREADY_EXISTS")
		})
	})

	describe('updateUser', () => {
		test.each`
			field | value
			${'name'} | ${{ name: 'new user' }}
			${'name" and "password'} | ${{ name: 'new user', password: 'new password' }}
		`('should updated database fields "$fields"', async ({ value }) => {
			const updateRes = await updateUser(BASE_USER_ID, value, client)

			expect(updateRes.updatedAt.toISO()).not.toBe(updateRes.createdAt.toISO())
			expect(updateRes.name).toBe(value.name)
			if (value.password) expect(updateRes.password).toBe(value.password)
			else expect(updateRes.password).toBeDefined()
			expect(updateRes.id).toBe(BASE_USER_ID)

			const res = await findUser(BASE_USER_ID, client)
			expect(res).toMatchObject(updateRes)
		})

		/*
		it('should ignore fields that are not updatable', async () => {
			const user = { id: 10, updatedAt: DateTime.now(), createdAt: DateTime.now()}
			const intialData = await findUser(BASE_USER_ID, client)
			const updateRes = await updateUser(BASE_USER_ID, user, client)

			expect(intialData).toMatchObject(updateRes)
			expect(user).not.toMatchObject(updateRes)

			const res = await findUser(BASE_USER_ID, client)

			expect(res).toMatchObject(intialData)
		})*/

		it('should throw error when no fields to update', async () => {
			const user = { id: 10, updatedAt: DateTime.now(), createdAt: DateTime.now()}

			await expect(updateUser(BASE_USER_ID, user))
				.rejects
				.toThrow('NO_FIELDS_TO_UPDATE')
		})

		it('should throw not found error if user isn\'t found', async () => {
			await expect(updateUser(-1, {name: 'new name'}))
				.rejects
				.toThrow('USER_NOT_FOUND')
		})
	})

	describe('deleteUser', () => {

		it('should delete the user', async () => {
			await expect(deleteUser(BASE_USER_ID)).resolves
		})

		it('should throw not found error if user isn\'t found', async () => {
			await expect(deleteUser(-1))
				.rejects
				.toThrow('USER_NOT_FOUND')
		})
	})
})

function expectUserToMatchBase(res: User | undefined) {
	expectUserToMatch(res, BASE_USER_ID, BASE_USER_EMAIL, BASE_USER_NAME)
}

function expectUserToMatch(res: User | undefined, id: number, email: string, name: string) {
	expect(res).toBeDefined()

	expect(res.id).toEqual(id)
	expect(res.email).toEqual(email)
	expect(res.name).toEqual(name)
	expect(res.password).toBeDefined()
	expect(res.createdAt).toBeDefined()
	expect(res.updatedAt).toBeDefined()
}
