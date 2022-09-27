import {query} from '../../src/database/services/databaseService'
import {generateJwtToken, login, validateToken} from '../../src/services/authenticateService'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import HttpErrorBadRequest from '../../src/errors/HttpErrorBadRequest'

describe('login', () => {
	const data = ['TEST_NAME', 'AUTH_TEST_EMAIL', bcrypt.hashSync('TEST_PASSWORD', 1)]
	beforeAll(async () => {
		await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', data)
	})

	afterAll(async () => {
		await query('DELETE FROM users WHERE name = $1 AND email = $2 AND password = $3', data)
	})

	it('should return user info', async () => {
		await expect(login('AUTH_TEST_EMAIL', 'TEST_PASSWORD'))
			.resolves
			.not.toBeNull()
	})

	it('should throw an error if email doesn\'t exist', async () => {
		await expect(login('TEST', 'TEST_PASSWORD'))
			.rejects
			.toThrow(HttpErrorBadRequest)
	})

	it('should throw an error if password doesn\'t match the email', async () => {
		await expect(login('TEST_EMAIL', 'TEST'))
			.rejects
			.toThrow(HttpErrorBadRequest)
	})
})

describe('validateToken', () => {
	it('should return id inside the payload', async () => {
		await expect(validateToken(generateJwtToken(9))).toBe(9)
	})

	test.each`
	msg 						| token
	${'is expired'}				| ${jwt.sign({ id: 9 }, process.env.JWT_TOKEN, { expiresIn: -20000 })}
	${'has invalid signature'}	| ${jwt.sign({ id: 9 }, 'random key')}
	${'is malformed'}			| ${'random token'}
	${'is undefined'}			| ${undefined}
	${'is null'}				| ${null}
	${'is empty'}				| ${''}
	`('should throw an error with 401 status when token ("$msg")', async ({ token }) => {
		try {
			validateToken(token)
		} catch(err) {
			await expect(err.status).toBe(401)
			await expect(err.message).toBe('INVALID_TOKEN')
		}
	})
})
