import {begin, query, rollback} from './shared'
import {PoolClient} from 'pg'
import {getPublicSubjects, getSubjects, saveSubject, updateSubject} from "./subjectsRepository";

describe('subjectsRepository', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterEach(async () => {
		await rollback(client)
	})

	describe('getSubjects', () => {
		it('should return all subjects', async () => {
			const subject = await getSubjects(client)
			expect(subject).toBeDefined()
			expect(subject).toHaveLength(4)
		})
	})

	describe('getPublicSubjects', () => {
		it('should return all public subjects', async () => {
			const subject = await getPublicSubjects(client)
			expect(subject).toBeDefined()
			expect(subject).toHaveLength(4)
		})
	})

	describe('saveSubject', () => {
		it('should save a subject', async () => {
			await saveSubject({ name: 'SAVE_SUBJECT_1', active: true }, client)

			const subject = await query('SELECT * FROM subjects WHERE name = $1', ['SAVE_SUBJECT_1'], client)

			expect(subject).toBeDefined()
			expect(subject.rows[0]).toMatchObject({ name: 'SAVE_SUBJECT_1', active: true })
		})
	})

	describe('updateSubject', () => {
		it('should update a subject', async () => {
			await updateSubject(1, { name: 'UPDATE_SUBJECT_1', active: true }, client)

			const subject = await query('SELECT * FROM subjects WHERE id = $1', [1], client)

			expect(subject).toBeDefined()

			expect(subject.rows[0]).toMatchObject({ id: 1, name: 'UPDATE_SUBJECT_1', active: true })
		})

		it('should throw error, when no fields to update', async () => {
			await expect(updateSubject(1, {fieldThatNoExists: false} as unknown, client))
				.rejects.toThrowError('NO_FIELDS_TO_UPDATE')
		})

		it('should throw error, when subject not found', async () => {
			await expect(updateSubject(0, {active: false}, client))
				.rejects.toThrowError('SUBJECT_NOT_FOUND')
		})
	})
})
