import {PoolClient} from 'pg'
import {begin, rollback} from './shared'
import {
	deleteWork,
	findPublicWorkWithTitle,
	findWorks,
	findWorkWithTitle,
	saveWork,
	updateWork
} from "./worksRepository"
import {Work} from "./models"
import {DateTime} from "luxon"

const ACTIVE_WORK = {
	id: 2,
	subjectId: 1,
	title: "work_2 search_term",
	description: "work_2_desc",
	priority: false,
	active: true,
	graduationYear: undefined,
	isVideoPreviewImage: false
} as Work

const INACTIVE_WORK = {
	id: 1,
	subjectId: 2,
	title: "work_1",
	description: "work_1_desc",
	priority: false,
	active: false,
	graduationYear: undefined,
	isVideoPreviewImage: false
} as Work

describe('workRepository', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterEach(async () => {
		await rollback(client)
	})

	describe('findWorkWithTitle', () => {
		it('should return when searching for an active work', async () => {
			const res = await findWorkWithTitle(ACTIVE_WORK.title, client)

			expect(res).toMatchObject(ACTIVE_WORK)
		})

		it('should return when searching for an inactive work', async () => {
			const res = await findWorkWithTitle(INACTIVE_WORK.title, client)

			expect(res).toMatchObject(INACTIVE_WORK)
		})

		it('should throw error when work doesn\'t exist', async () => {
			await expect(findWorkWithTitle("DOES NOT EXIST", client))
				.rejects
				.toThrow("WORK_NOT_FOUND")
		})
	})

	describe('findPublicWorkWithTitle', () => {
		it('should return when searching for an active work', async () => {
			const res = await findPublicWorkWithTitle(ACTIVE_WORK.title, client)

			expect(res).toMatchObject(ACTIVE_WORK)
		})

		it('should throw error when searching for an inactive work', async () => {
			await expect(findPublicWorkWithTitle(INACTIVE_WORK.title, client))
				.rejects
				.toThrow("WORK_NOT_FOUND")
		})

		it('should throw error when work doesn\'t exist', async () => {
			await expect(findPublicWorkWithTitle("DOES NOT EXIST", client))
				.rejects
				.toThrow("WORK_NOT_FOUND")
		})
	})

	describe('findWorks', () => {
		it('should return all works', async () => {
			const res = await findWorks(undefined, client)

			expect(res).toHaveLength(3)
		})

		it('should return all active works if params active is set true', async () => {
			const res = await findWorks({active: true}, client)

			expect(res).toHaveLength(2)
		})

		it('should return all not active works if params active is set false', async () => {
			const res = await findWorks({active: false}, client)

			expect(res).toHaveLength(1)
		})

		it('should return all works with works "Rakendusinformaatika" and "Tervisejuht"', async () => {
			const res = await findWorks({
				subjects: ['Rakendusinformaatika', 'Tervisejuht']
			}, client)

			expect(res).toHaveLength(2)
		})

		it('should return all works with tags "tag1" and "tag2"', async () => {
			const res = await findWorks({
				tags: ['tag_1', 'tag_4']
			}, client)

			expect(res).toHaveLength(2)
		})

		it('should return all works with authors "author1" and "author2"', async () => {
			const res = await findWorks({
				authors: ['author_1', 'author_3']
			}, client)

			expect(res).toHaveLength(2)
		})

		it('should return all works with word "search_term"', async () => {
			const res = await findWorks({
				q:'search_term'
			}, client)

			expect(res).toHaveLength(2)
		})
	})

	describe('deleteWork', () => {
		it('should delete existing work', async () => {
			await expect(findWorkWithTitle(ACTIVE_WORK.title, client))
				.resolves
				.toBeDefined()

			await deleteWork(ACTIVE_WORK.id, client)

			await expect(findWorkWithTitle(ACTIVE_WORK.title, client))
				.rejects
				.toThrowError("WORK_NOT_FOUND")
		})

		it('should throw error when work does not exist', async () => {
			await expect(deleteWork(-1, client))
				.rejects
				.toThrowError("WORK_NOT_FOUND")
		})
	})

	describe('saveWork', () => {
		it('should save work', async () => {
			const work = {
				subjectId: 1,
				title: "save_work",
				description: "save_work",
				priority: true,
				active: false,
				graduationYear: 2022,
				isVideoPreviewImage: false
			}
			const res = await saveWork(work, client)
			expect(res).toMatchObject(work)

			await expect(findWorkWithTitle(work.title, client))
				.resolves
				.toMatchObject(res)
		})

		it('should throw error when work with name already exists', async () => {
			await expect(saveWork(ACTIVE_WORK, client))
				.rejects
				.toThrow("TITLE_ALREADY_EXISTS")
		})
	})

	describe('updateWork', () => {
		test.each`
			field | value
			${'subjectId'} | ${{ subjectId: 2 }}
			${'title'} | ${{ title: 'new title' }}
			${'description'} | ${{ description: 'new description' }}
			${'priority'} | ${{ priority: true }}
			${'active'} | ${{ active: true }}
			${'graduationYear'} | ${{ graduationYear: 2022 }}
			${'isVideoPreviewImage'} | ${{ isVideoPreviewImage: true }}
			${'title" a "description'} | ${{ title: 'new title', description: 'new description' }}
		`('should updated database fields "$field"', async ({ value }) => {
			const intialWork = await findWorkWithTitle(ACTIVE_WORK.title, client)
			const updateRes = await updateWork(ACTIVE_WORK.id, value, client)

			expect(intialWork).not.toMatchObject(updateRes)

			delete intialWork.createdAt
			delete intialWork.updatedAt

			expect(updateRes).toMatchObject({
				...intialWork,
				...value
			})

			const afterUpdateWork = await findWorkWithTitle(
				value.title ? value.title : ACTIVE_WORK.title,
				client)
			expect(afterUpdateWork).toMatchObject(updateRes)
		})

		it('should throw error when no fields to update', async () => {
			const work = { id: 10, updatedAt: DateTime.now(), createdAt: DateTime.now()}

			await expect(updateWork(ACTIVE_WORK.id, work, client))
				.rejects
				.toThrow('NO_FIELDS_TO_UPDATE')
		})

		it('should throw not found error if work isn\'t found', async () => {
			await expect(updateWork(-1, {title: 'new title'}, client))
				.rejects
				.toThrow('WORK_NOT_FOUND')
		})
	})
})

