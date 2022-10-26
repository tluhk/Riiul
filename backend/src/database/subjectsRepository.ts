import {query} from './shared'
import { Subject } from './models'
import HttpErrorBadRequest from '../shared/errors/HttpErrorBadRequest'
import {PoolClient} from 'pg'
import {DateTime} from "luxon";

const UPDATABLE_FIELDS = ['name', 'active']

export async function findSubjectWithId(id: number, client?: PoolClient): Promise<Subject> {
	const { rows } = await query<Subject>('SELECT * FROM subjects WHERE id = $1', [id], client)

	return rows[0]
}

export async function getSubjects(client?: PoolClient): Promise<Subject[]> {
	const { rows } = await query<Subject>('SELECT * FROM subjects ORDER BY id desc', [], client)

	return rows
}

export async function getPublicSubjects(client?: PoolClient): Promise<Subject[]> {
	const { rows } = await query<Subject>('SELECT * FROM subjects WHERE active = true ORDER BY id desc', [], client)

	return rows
}

export async function saveSubject(subject: Partial<Subject>, client?: PoolClient): Promise<Subject> {
	const data = [subject.name, subject.active]
	const { rows } = await query<Subject>('INSERT INTO subjects (name, active) VALUES ($1, $2) RETURNING *', data, client)

	return rows[0]
}

export async function updateSubject(id: number, subject: Partial<Subject>, client?: PoolClient): Promise<Subject | undefined> {
	const values: Array<string | number | boolean> = [id]
	const fields = []

	for (const [key, value] of Object.entries(subject)) {
		if (!UPDATABLE_FIELDS.includes(key) || value instanceof DateTime) continue

		values.push(value)
		fields.push(`${key} = $${values.length}`)
	}

	if (fields.length === 0) throw new HttpErrorBadRequest('NO_FIELDS_TO_UPDATE')

	const res = await query<Subject>(`UPDATE subjects SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`, values, client)

	return res.rows[0] || undefined
}

