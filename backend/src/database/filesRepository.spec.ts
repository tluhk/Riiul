import {begin, rollback} from './shared'
import {findFileWithNameAndExtension, findFilesWithWorkId, saveFile, deleteFile, updateFile} from './filesRepository'
import {PoolClient} from 'pg'

describe('filesRepository', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterEach(async () => {
		await rollback(client)
	})

	describe('findFileWithNameAndExtension', () => {
		it('should return a file', async () => {
			const res = await findFileWithNameAndExtension('uuid-original-name-1', 'pdf', client)

			expect(res).toMatchObject({
				id: 1,
				workId: 1,
				workOrder: 0,
				name: 'uuid-original-name-1',
				extension: 'pdf',
				originalName: 'original-name-1.pdf'
			})
		})

		it('should return null', async () => {
			const res = await findFileWithNameAndExtension('no exists', 'test', client)

			expect(res).toBeNull()
		})
	})

	describe('findFilesWithWorkId', () => {
		it('should return all files when searching with work', async () => {
			const res = await findFilesWithWorkId( [1, 2], client)

			expect(res.length).toEqual(3)
		})
	})

	describe('saveFile', () => {
		it('should return a newly created file', async () => {
			const file = {
				workId: 1,
				workOrder: 0,
				name: 'uuid-original-name-5',
				extension: 'pdf',
				type: 'PDF',
				originalName: 'original-name-5.pdf'
			}

			const res = await saveFile(file, client)

			expect(res).not.toBeNull()
			expect(res).toMatchObject(file)

			expect(res.id).not.toBeNull()
			expect(res.createdAt).not.toBeNull()
			expect(res.updatedAt).not.toBeNull()
		})
	})

	describe('deleteFile', () => {
		it('should delete the file', async () => {
			await deleteFile(1, client)

			const res = await findFilesWithWorkId([1], client)

			expect(res).not.toBeNull()
			expect(res.length).toBe(0)
		})

		it('should throw not found error if file isn\'t found', async () => {
			await expect(deleteFile(-1, client))
				.rejects
				.toThrow("FILE_NOT_FOUND")
		})
	})

	describe('updateFile', () => {
		it('should update the file', async () => {
			const res = await updateFile(1, 1, client)

			expect(res).not.toBeNull()
			expect(res).toMatchObject({
				id: 1,
				workOrder: 1
			})
		})

		it('should throw not found error if file isn\'t found', async () => {
			await expect(updateFile(-1, 1, client))
				.rejects
				.toThrow("FILE_NOT_FOUND")
		})
	})
})
