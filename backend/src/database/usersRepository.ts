import {query} from './shared'
import {User} from './models'
import HttpErrorNotFound from '../shared/errors/HttpErrorNotFound'
import {PoolClient} from 'pg'
import {DateTime} from "luxon";
import HttpErrorBadRequest from "../shared/errors/HttpErrorBadRequest";

const UPDATABLE_FIELDS = ['name', 'email', 'password']

export async function findUser(id: number, client?: PoolClient): Promise<User | undefined> {
	const {rows} = await query<User>('SELECT * FROM users WHERE id = $1', [id], client)

	return rows[0]
}

export async function getUsers(): Promise<User[]> {
	const {rows} = await query<User>('SELECT * FROM users')

	return rows
}

export async function findUserWithEmail(email: string): Promise<User | undefined> {
	const {rows} = await query<User>('SELECT * FROM users WHERE email = $1', [email])

	return rows[0]
}

export async function saveUser(user: Partial<User>, client?: PoolClient): Promise<User> {
	const data = [user.name, user.email, user.password]
	const {rows} = await query<User>('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', data, client)

	return rows[0]
}

export async function updateUser(id: number, user: Partial<User>, client?: PoolClient): Promise<User> {
	const values: Array<string | number> = [id, new Date().toISOString()]
	const fields = []

	for (const [key, value] of Object.entries(user)) {
		if (!UPDATABLE_FIELDS.includes(key) || value instanceof DateTime) continue

		values.push(value)
		fields.push(`${key} = $${values.length}`)
	}

	if (fields.length === 0) throw new HttpErrorBadRequest('NO_FIELDS_TO_UPDATE')

	const res = await query<User>(`UPDATE users SET ${fields.join(', ')}, updated_at = $2 WHERE id = $1 RETURNING *`, values, client)

	if (res.rowCount === 0) throw new HttpErrorNotFound('USER_NOT_FOUND')
	return res.rows[0]
}

export async function deleteUser(id: number, client?: PoolClient): Promise<void> {
	const res = await query('DELETE FROM users WHERE id = $1', [id], client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('USER_NOT_FOUND')
}
