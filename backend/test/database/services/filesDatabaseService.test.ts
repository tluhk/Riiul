/* eslint-disable */
import {begin, query, rollback} from '../../../src/database/services/databaseService'
import filesDatabaseService from '../../../src/database/services/filesDatabaseService'
import faker from 'faker'
import FileDatabaseType from '../../../src/database/types/FileDatabaseType'
import {DateTime} from 'luxon'
import {PoolClient} from 'pg'

describe('findWithNameAndExtension', () => {
	let client: PoolClient
	const originalName = faker.random.word()
	const data = [`${faker.datatype.uuid()}-${originalName}`, 'pdf', originalName]
	let id: number

	beforeAll(async () => {
		client = await begin()

		const newWork = await query<{ id: number }>(
            `INSERT INTO works (subject_id, title, description, priority, active) VALUES
				($1, $2, $3, $4, $5) RETURNING id`,
			[1, faker.random.word(), faker.random.word(), 'false', 'true'],
			client
        )
		id = newWork.rows[0].id

		await query<FileDatabaseType>(
			'INSERT INTO files (work_id, work_order, name, extension, original_name)' + 'VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[id, 0, ...data],
			client)
	})

	afterAll(async () => {
		await rollback(client)
	})

	it('should return a file', async () => {
		const res = await filesDatabaseService.findWithNameAndExtension(data[0], data[1], client)

		expect(res).toMatchObject({
			workId: id,
			workOrder: 0,
			name: data[0],
			extension: data[1],
			originalName: data[2],
		})
	})

	it('should return null', async () => {
		const res = await  filesDatabaseService.findWithNameAndExtension('no exists', 'test', client)

		expect(res).toBeNull()
	})
})

describe('findWithWorksId', () => {
	let client: PoolClient
	const originalName = [faker.random.word(), faker.random.word()]

	let worksIds: number[]

	beforeAll(async () => {
		client = await begin()
		const works = [...new Array(2)].map(() => ([
            1, faker.random.word(), faker.random.word(), 'false', 'true'
        ]))
		const newWork = await query<{ id: number }>(
			`INSERT INTO works (subject_id, title, description, priority, active) VALUES
				($1, $2, $3, $4, $5),
				($6, $7, $8, $9, $10) RETURNING id`,
			works.flat(),
			client
		)
		worksIds = newWork.rows.map(({ id }) => id)

		await query<FileDatabaseType>(
			'INSERT INTO files (work_id, work_order, name, extension, original_name)' +
			'VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10) RETURNING *',
			originalName.map((name, i) => [
				worksIds[i], 0, `${DateTime.now().toMillis()}-${name}`, 'pdf', name
			]).flat(),
			client)
	})

	afterAll(async () => {
		await rollback(client)
	})

	test.each`
		index | length
		${[0]} | ${1}
		${[0, 1]} | ${2}
		${[]} | ${0}
	`('should return $length files when searched with "$index" work indexes', async ({ index, length}: { index: number[], length: number}) => {
        const res = await filesDatabaseService.findWithWorksId(index.map(i => worksIds[i]), client)

		expect(res).not.toBeNull()
        expect(res.length).toBe(length)
    })
})

describe('save', () => {
	let client: PoolClient

	const uniqueKey = 'FILES_DATABASE_SERVICE_SAVE_'
	let workId: number
	const file = {
		name: uniqueKey + 'NAME',
		extension: 'pdf',
		originalName: uniqueKey + 'ORIGINAL_NAME',
		workOrder: faker.datatype.number(),
		type: "PDF"
	}

	beforeEach(async () => {
		client = await begin()
		const res = await query<{ id: number }>(
			`INSERT INTO works (subject_id, title, description, priority, active) VALUES
				($1, $2, $3, $4, $5) RETURNING id`,
			[1, faker.random.word(), faker.random.word(), 'false', 'true'],
			client
		)

		workId = res.rows[0].id
	})

	afterEach(async () => {
		await rollback(client)
	})

	it('should return a newly created file', async () => {
		const res = await filesDatabaseService.save({ ...file, workId: workId }, client)

		expect(res).not.toBeNull()
		expect(res).toMatchObject({...file, workId})

		expect(res.id).not.toBeNull()
		expect(res.createdAt).not.toBeNull()
		expect(res.updatedAt).not.toBeNull()
	})
})

describe('delete', () => {
	let client: PoolClient

	const originalName = faker.random.word()
	const data = [`${faker.datatype.uuid()}-${originalName}`, 'pdf', originalName]
	let id: number
	let workId: number

	beforeEach(async () => {
		client = await begin()

		const newWork = await query<{ id: number }>(
			`INSERT INTO works (subject_id, title, description, priority, active) VALUES
				($1, $2, $3, $4, $5) RETURNING id`,
			[1, faker.random.word(), faker.random.word(), 'false', 'true'],
			client
		)
		workId = newWork.rows[0].id

		const res = await query<FileDatabaseType>(
			'INSERT INTO files (work_id, work_order, name, extension, original_name)' +
			'VALUES ($1, $2, $3, $4, $5) RETURNING *', [newWork.rows[0].id, 0, ...data],
			client)
		id = res.rows[0].id
	})

	afterEach(async () => {
		await rollback(client)
	})

	it('should delete the file', async () => {
		await filesDatabaseService.deleteFile(id, client)

		const res = await query('SELECT * FROM files WHERE id = $1', [id], client)

		expect(res).not.toBeNull()
		expect(res.rowCount).toBe(0)
	})

	it('should throw not found error if file isn\'t found', async () => {
		await expect(filesDatabaseService.deleteFile(id + 1, client))
			.rejects
			.toThrow("FILE_NOT_FOUND")
	})
})

describe('updateFile', () => {
	const originalName = faker.random.word()
	const data = [0, `${faker.datatype.uuid()}-${originalName}`, 'pdf', originalName]

	let client: PoolClient
	let id: number

	beforeEach(async () => {
		client = await begin()

		const newWork = await query<{ id: number }>(
			`INSERT INTO works (subject_id, title, description, priority, active) VALUES
				($1, $2, $3, $4, $5) RETURNING id`,
			[1, faker.random.word(), faker.random.word(), false, true],
			client
		)

		const res = await query<FileDatabaseType>(
			'INSERT INTO files (work_id, work_order, name, extension, original_name)' +
			'VALUES ($1, $2, $3, $4, $5) RETURNING *', [newWork.rows[0].id, ...data],
			client)

		id = res.rows[0].id
	})

	afterEach(async () => {
		await rollback(client)
	})

	it('should update the file', async () => {
		const res = await filesDatabaseService.updateFile(id, 1, client)

		expect(res).not.toBeNull()
		expect(res).toMatchObject({
			id,
			workOrder: 1,
			name: data[1],
			extension: data[2],
			originalName: data[3]
		})
	})

	it('should throw not found error if file isn\'t found', async () => {
		await expect(filesDatabaseService.updateFile(id + 1, 1, client))
			.rejects
			.toThrow("FILE_NOT_FOUND")
	})
})
