import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import usersDatabaseService from '../database/services/usersDatabaseService'
import HttpErrorBadRequest from '../errors/HttpErrorBadRequest'
import HttpErrorUnauthorized from '../errors/HttpErrorUnauthorized'

export async function login(email: string, password: string): Promise<string> {
	const res = await usersDatabaseService.findUserWithEmail(email)
	if (!res || !bcrypt.compareSync(password, res.password)) throw new HttpErrorBadRequest('INVALID_EMAIL_OR_PASSWORD')

	return generateJwtToken(res.id)
}

export function generateJwtToken(id: number): string {
	return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: 60 * 60 })
}

export function validateToken(token: string): number | null {
	let decoded: jwt.JwtPayload

	try {
		decoded = jwt.verify(token, process.env.JWT_TOKEN) as jwt.JwtPayload
	} catch (err) {
		throw new HttpErrorUnauthorized('INVALID_TOKEN', err)
	}

	return decoded?.id || null
}
