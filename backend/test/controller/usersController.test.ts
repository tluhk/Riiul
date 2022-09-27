import request from 'supertest'
import app from '../../src/app'
import * as faker from 'faker'
import {query} from '../../src/database/services/databaseService'
import {generateJwtToken} from '../../src/services/authenticateService'
import UserDatabaseType from '../../src/database/types/UserDatabaseType'

describe('get all users', () => {
	it('should return 200 response', async () => {
		const response = await request(app)
			.get('/users')
			.set('Authorization', generateJwtToken(1))

		expect(response.statusCode).toBe(200)
		expect(response.body.users).not.toBeNull()
	})

	it('should respond with 401 error', async () => {
		const response = await request(app)
			.get('/users')

		expect(response.statusCode).toBe(401)
	})
})

describe('find one user', () => {
	const data = [faker.name.firstName(), faker.internet.email(), faker.internet.password()]
	let id: number

	beforeAll(async () => {
		const res = await query<UserDatabaseType>('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', data)
		id = res.rows[0].id
	})

	afterAll(async () => {
		await query('DELETE FROM users WHERE id = $1', [id])
	})

	it('should return 200 response', async () => {
		const response = await request(app)
			.get('/users/' + id)
			.set('Authorization', generateJwtToken(1))

		expect(response.statusCode).toBe(200)
		expect(response.body).toStrictEqual({
			id,
			name: data[0],
			email: data[1]
		})
	})

	it('should respond with 404 error', async () => {
		const response = await request(app)
			.get('/users/-1')
			.set('Authorization', generateJwtToken(1))

		expect(response.statusCode).toBe(404)
	})

	it('should respond with 401 error', async () => {
		const response = await request(app)
			.get('/users')

		expect(response.statusCode).toBe(401)
	})
})

describe('post', () => {
	const body = {
		name: faker.name.firstName(),
		password: faker.internet.password(),
		email: faker.internet.email()
	}

	it('should return 200 response', async () => {
		const response = await request(app)
			.post('/users')
			.set('Authorization', generateJwtToken(1))
			.send(body)

		expect(response.statusCode).toBe(200)
		expect(response.body).toStrictEqual({})
	})

	afterAll(async () => {
		await query('DELETE FROM users WHERE name = $1 and email = $2', [body.name, body.email])
	})
})

describe('update', () => {
	const body = {
		name: faker.name.firstName(),
		email: faker.internet.email(),
	}
	let id: number

	beforeEach(async () => {
		const res = await query<UserDatabaseType>('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
			[faker.name.firstName(), faker.internet.email(), faker.internet.password()])
		id = res.rows[0].id
	})

	afterEach(async () => {
		await query('DELETE FROM users WHERE id = $1', [id])
	})

	it('should return 200 response', async () => {
		const response = await request(app)
			.put('/users/' + id)
			.set('Authorization', generateJwtToken(1))
			.send(body)

		expect(response.statusCode).toBe(200)
		expect(response.body).toStrictEqual({})
	})

	it('should respond with 401 error', async () => {
		const response = await request(app)
			.put('/users/' + id)
			.send(body)

		expect(response.statusCode).toBe(401)
	})
})

describe('delete', () => {
	let id: number

	beforeEach(async () => {
		const res = await query<UserDatabaseType>('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
			[faker.name.firstName(), faker.internet.email(), faker.internet.password()])
		id = res.rows[0].id
	})

	afterEach(async () => {
		await query('DELETE FROM users WHERE id = $1', [id])
	})

	it('should return 200 response', async () => {
		const response = await request(app)
			.delete('/users/' + id)
			.set('Authorization', generateJwtToken(1))

		expect(response.statusCode).toBe(200)
		expect(response.body).toStrictEqual({})
	})

	it('should respond with 401 error', async () => {
		const response = await request(app)
			.delete('/users/' + id)

		expect(response.statusCode).toBe(401)
	})

	it('should respond with 400, when user tries to delete itself', async () => {
		const response = await request(app)
			.delete('/users/' + id)
			.set('Authorization', generateJwtToken(id))

		expect(response.body).toStrictEqual({
			status: 400,
			message: 'USER_CANNOT_DELETE_HIMSELF'
		})

		expect(response.statusCode).toBe(400)
	})
})
