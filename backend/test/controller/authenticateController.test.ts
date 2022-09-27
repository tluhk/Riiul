import request from 'supertest'
import app from '../../src/app'

describe('login', () => {
	it('should return when logging in with correct credentials', async () => {
		const body = {
			password: 'test_password',
			email: 'test.test@gmail.com'
		}

		const response = await request(app)
			.post('/authenticate/login')
			.send(body)

		expect(response.statusCode).toBe(200)

		expect(response.body).toStrictEqual({})
	})

	it('should return error when email is incorrect', async () => {
		const body = {
			password: 'test_password',
			email: 'incorrect@gmail.com'
		}

		const response = await request(app)
			.post('/authenticate/login')
			.send(body)

		expect(response.body).toStrictEqual({
			status: 400,
			message: 'INVALID_EMAIL_OR_PASSWORD'
		})
	})

	it('should return error when password doesn\'t match email', async () => {
		const body = {
			password: 'incorrect',
			email: 'test.test@gmail.com'
		}

		const response = await request(app)
			.post('/authenticate/login')
			.send(body)

		expect(response.body).toStrictEqual({
			status: 400,
			message: 'INVALID_EMAIL_OR_PASSWORD'
		})
	})
})
