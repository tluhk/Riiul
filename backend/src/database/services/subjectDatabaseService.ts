import {query} from './databaseService'
import Subject from '../../types/Subject'
import subjectMapper from '../mappers/subjectMapper'
import SubjectDatabaseType from '../types/SubjectDatabaseType'
import SubjectPostBody from '../../types/SubjectsPostBody'
import SubjectUpdateBody from '../../types/SubjectUpdateBody'
import HttpErrorBadRequest from '../../errors/HttpErrorBadRequest'
import HttpErrorNotFound from '../../errors/HttpErrorNotFound'
import {PoolClient} from 'pg'

const UPDATABLE_FIELDS = ['name', 'active']

export async function allSubjects(client?: PoolClient): Promise<Subject[]> {
	const res = await query<SubjectDatabaseType>('SELECT * FROM subjects ORDER BY id desc', [], client)

	return res.rows.map(subjectMapper)
}

export async function allSubjectsPublic(client?: PoolClient): Promise<Subject[]> {
	const res = await query<SubjectDatabaseType>('SELECT * FROM subjects WHERE active = true ORDER BY id desc', [], client)

	return res.rows.map(subjectMapper)
}

export async function saveSubject(subject: SubjectPostBody, client?: PoolClient): Promise<Subject> {
	const data = [subject.name, subject.active]
	const res = await query<SubjectDatabaseType>('INSERT INTO subjects (name, active) VALUES ($1, $2) RETURNING *', data, client)

	return  subjectMapper(res.rows[0])
}

export async function updateSubject(id: number, subject: SubjectUpdateBody, client?: PoolClient): Promise<Subject> {
	const values: Array<string | number | boolean> = [id]
	const fields = []

	for (const [key, value] of Object.entries(subject)) {
		if (!UPDATABLE_FIELDS.includes(key)) continue

		values.push(value)
		fields.push(`${key} = $${values.length}`)
	}

	if (fields.length === 0) throw new HttpErrorBadRequest('NO_FIELDS_TO_UPDATE')

	const res = await query<SubjectDatabaseType>(`UPDATE subjects SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`, values, client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('SUBJECT_NOT_FOUND')

	return subjectMapper(res.rows[0])
}

export default {
	allSubjects,
	allSubjectsPublic,
	saveSubject,
	updateSubject
}
