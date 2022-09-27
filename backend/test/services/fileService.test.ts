import {getFile, saveFile} from '../../src/services/filesService'
import fs from 'fs'
import path from 'path'
import filesDatabaseService from '../../src/database/services/filesDatabaseService'
import {begin, query, rollback} from '../../src/database/services/databaseService'
import faker from 'faker'
import {PoolClient} from 'pg'

const IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
const dir = path.join(__dirname, '../../files/')

describe('getFile', () => {
	it('should return the image buffer', async () => {
		const data = Buffer.allocUnsafe(1)

		jest.spyOn(fs, 'existsSync').mockImplementation(() => true)
		jest.spyOn(fs, 'readFileSync').mockImplementation(() => data)

		await expect(getFile('get-file-return.png')).resolves
			.toEqual(data)
	})

	it('should throw 404 error', async () => {
		jest.spyOn(fs, 'existsSync').mockImplementation(() => false)
		jest.spyOn(fs, 'readFileSync').mockImplementation()

		await expect(getFile('get-file-throw.png')).rejects
			.toMatchObject({ status: 404 })
	})
})

describe('saveFile', () => {
	let id: number
	let client: PoolClient

	beforeAll(async () => {
		client = await begin()

		const res = await query<{id: number}>(`INSERT INTO works (subject_id, title, description, priority, active) VALUES
				($1, $2, $3, $4, $5) RETURNING id`,
		[1, faker.random.word(), faker.random.word(), 'false', 'true'], client)

		id = res.rows[0].id
	})

	afterAll(async () => {
		await rollback(client)
	})

	it('should store the file on the disk', async () => {
		jest.spyOn(fs, 'writeFileSync').mockImplementation()
		jest.spyOn(fs, 'existsSync').mockImplementation(() => true)

		const res = await saveFile('save-file-store.png', IMAGE_BASE64, { order: 0, id }, client)

		expect(res).not.toBeNull()
		expect(res.originalName).toBe('save-file-store')
		expect(res.extension).toBe('png')
		expect(res.name).toMatch(/[0-9]{13}-save-file-store/)

		expect(res.createdAt).not.toBeNull()
		expect(res.updatedAt).not.toBeNull()

		await expect(filesDatabaseService.findWithNameAndExtension(res.name, res.extension, client)).resolves.toEqual(res)
	})

	it('should create the path', async () => {
		jest.spyOn(filesDatabaseService, 'save').mockImplementation()
		jest.spyOn(fs, 'writeFileSync').mockImplementation()
		const spyMkdirSync = jest.spyOn(fs, 'mkdirSync').mockImplementation()
		const spyExistsSync = jest.spyOn(fs, 'existsSync').mockImplementation(() => false)

		await saveFile('save-file-create.png', IMAGE_BASE64, { order: 1, id }, client)

		expect(spyExistsSync).toHaveBeenCalledWith(dir)
		expect(spyMkdirSync).toHaveBeenCalledWith(dir, { recursive: true })
	})

	it('should not create the path', async () => {
		jest.spyOn(filesDatabaseService, 'save').mockImplementation()
		jest.spyOn(fs, 'writeFileSync').mockImplementation()
		const spyMkdirSync = jest.spyOn(fs, 'mkdirSync').mockImplementation()
		const spyExistsSync = jest.spyOn(fs, 'existsSync').mockImplementation(() => true)

		await saveFile('save-file-create-not.png', IMAGE_BASE64, { order: 3, id }, client)

		expect(spyExistsSync).toHaveBeenCalledWith(dir)
		expect(spyMkdirSync).not.toHaveBeenCalledWith('save-file-create-not.png', { recursive: true })
	})
})
