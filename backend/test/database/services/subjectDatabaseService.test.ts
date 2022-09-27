import subjectDatabaseService from '../../../src/database/services/subjectDatabaseService'
import {begin, query, rollback} from '../../../src/database/services/databaseService'
import SubjectDatabaseType from '../../../src/database/types/SubjectDatabaseType'
import SubjectUpdateBody from '../../../src/types/SubjectUpdateBody'
import {PoolClient} from 'pg'

let client: PoolClient

beforeEach(async () => {
	client = await begin()
	const allSubjects = [
		['subject_1', false],
		['subject_2', true],
		['subject_3', false],
		['subject_4', false],
	]

	await Promise.all(allSubjects.map(async (data) => {
		await query<SubjectDatabaseType>('INSERT INTO subjects (name, active) VALUES ($1, $2) RETURNING *',
			data, client)
	}))
})

afterEach(async () => {
	await rollback(client)
})

describe('allSubjects', () => {
	it('should return all subjects', async () => {
		const subject = await subjectDatabaseService.allSubjects(client)
		expect(subject).toBeDefined()
		expect(subject).toHaveLength(8)
	})
})

describe('allSubjectsPublic', () => {
	it('should return all public subjects', async () => {
		const subject = await subjectDatabaseService.allSubjectsPublic(client)
		expect(subject).toBeDefined()
		expect(subject).toHaveLength(5)
	})
})

describe('saveSubject', () => {
	it('should save a subject', async () => {
		await subjectDatabaseService.saveSubject({ name: 'SAVE_SUBJECT_1', active: true }, client)

		const subject = await query<SubjectDatabaseType>('SELECT * FROM subjects WHERE name = $1', ['SAVE_SUBJECT_1'], client)

		expect(subject).toBeDefined()
		expect(subject.rows[0]).toMatchObject({ name: 'SAVE_SUBJECT_1', active: true })
	})
})

describe('updateSubject', () => {
	it('should update a subject', async () => {
		await subjectDatabaseService.updateSubject(1, { name: 'UPDATE_SUBJECT_1', active: true }, client)

		const subject = await query<SubjectDatabaseType>('SELECT * FROM subjects WHERE id = $1', [1], client)

		expect(subject).toBeDefined()

		expect(subject.rows[0]).toMatchObject({ id: 1, name: 'UPDATE_SUBJECT_1', active: true })
	})

	it('should throw error, when no fields to update', async () => {
		await expect(subjectDatabaseService.updateSubject(1, {fieldThatNoExists: false} as SubjectUpdateBody, client))
			.rejects.toThrowError('NO_FIELDS_TO_UPDATE')
	})

	it('should throw error, when subject not found', async () => {
		await expect(subjectDatabaseService.updateSubject(0, {active: false} as SubjectUpdateBody, client))
			.rejects.toThrowError('SUBJECT_NOT_FOUND')
	})
})
