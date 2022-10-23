import {query} from './databaseService'
import * as databaseService from './databaseService'
import { pool } from './poolService'
import {DatabaseError, PoolClient} from 'pg'

describe('query', () => {
	let spyBegin: jest.SpyInstance<Promise<PoolClient>>
	let spyCommit: jest.SpyInstance<Promise<void>>
	let spyRollback: jest.SpyInstance<Promise<void>>

	beforeEach(async () => {
		spyBegin = await jest.spyOn(databaseService, 'begin')
		spyCommit = await jest.spyOn(databaseService, 'commit')
		spyRollback = await jest.spyOn(databaseService, 'rollback')
	})

	describe('when client provided', () => {
		let client: PoolClient

		beforeEach(async () => {
			client = await pool.connect()
		})

		afterEach(async () => {
			client.release()
		})

		it('should not preform start and commit query', async () => {
			const res = await query('SELECT * FROM pg_stat_activity', [], client)

			expect(spyBegin).not.toHaveBeenCalled()
			expect(spyCommit).not.toHaveBeenCalled()
			expect(spyRollback).not.toHaveBeenCalled()

			expect(res).not.toBeNull()
		})

		it('should not perform rollback when error occurs', async () => {
			await expect(query('12 SELECT * FROM pg_stat_activity', [], client))
				.rejects.not.toBeNull()

			expect(spyBegin).not.toHaveBeenCalled()
			expect(spyCommit).not.toHaveBeenCalled()
			expect(spyRollback).not.toHaveBeenCalled()
		})
	})

	describe('when client not provided', () => {
		it('should preform start and commit query', async () => {
			const res = await query('SELECT * FROM pg_stat_activity', [])

			expect(spyBegin).toHaveBeenCalled()
			expect(spyCommit).toHaveBeenCalled()
			expect(spyRollback).not.toHaveBeenCalled()

			expect(res).not.toBeNull()
		})

		it('should perform rollback when error occurs', async () => {
			await expect(query('12 SELECT * FROM pg_stat_activity', []))
				.rejects.not.toBeNull()

			expect(spyBegin).toHaveBeenCalled()
			expect(spyCommit).not.toHaveBeenCalled()
			expect(spyRollback).toHaveBeenCalled()
		})
	})

	it('should insert null into params, when empty string', async () => {
		const client = {
			connect: jest.fn(),
			query: jest.fn().mockResolvedValue({ rows: []}),
			release: jest.fn(),
		} as unknown as PoolClient

		await query('SELECT * FROM pg_stat_activity', ['start', '', 1, true, []], client)

		expect(client.query).toHaveBeenCalledWith('SELECT * FROM pg_stat_activity', ['start', null, 1, true, [] ])
	})

	test.each`
	column 						| resColumn
	${'test'}					| ${'TEST'}
	${'has_invalid_signature'}	| ${'HAS_INVALID_SIGNATURE'}
	${'Is_malfOrmEd'}			| ${'IS_MALFORMED'}
	`('should return is required error, when not-null error thrown and column "$column" should be capitalized to "$resColumn"', async ({column, resColumn}) => {
		const dbError = new DatabaseError('violates not-null constraint', 32, 'error')
		dbError.column = column

		const client = {
			connect: jest.fn(),
			query: jest.fn().mockRejectedValueOnce(dbError),
			release: jest.fn(),
		} as unknown as PoolClient

		await expect(query('SELECT * FROM pg_stat_activity', [], client))
			.rejects
			.toMatchObject({ message: resColumn +'_IS_REQUIRED', status: 400})
	})

	test.each`
	column 						| resColumn
	${'test'}					| ${'TEST'}
	${'has_invalid_signature'}	| ${'HAS_INVALID_SIGNATURE'}
	${'Is_malfOrmEd'}			| ${'IS_MALFORMED'}
	`('should return is required error, when not-null error thrown and column "$column" should be capitalized to "$resColumn"', async ({column, resColumn}) => {
		const dbError = new DatabaseError('duplicate key value violates unique constraint', 32, 'error')
		dbError.detail = `Key (${column}) already exists.`

		const client = {
			connect: jest.fn(),
			query: jest.fn().mockRejectedValueOnce(dbError),
			release: jest.fn(),
		} as unknown as PoolClient

		await expect(query('SELECT * FROM pg_stat_activity', [], client))
			.rejects
			.toMatchObject({ message: resColumn +'_ALREADY_EXISTS', status: 400})
	})
})
