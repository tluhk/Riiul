import {begin, rollback} from './shared'
import {PoolClient} from 'pg'
import {
	findAuthorWithWorkId,
	getAuthors,
	getPublicAuthors,
	removeAuthorFromWork,
	saveAuthor
} from "./authorsRepository"

const AUTHOR_NAME = 'AUTHORS_REPO_2'
const AUTHOR_WORK_ID = 2

describe('authorsRepository', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterEach(async () => {
		await rollback(client)
	})

	describe('getAuthors', () => {
		it('should return all authors', async () => {
			const authors = await getAuthors(client)

			expect(authors).toHaveLength(4)
		})
	})

	describe('getPublicAuthors', () => {
		it('should return all authors that have a public work attached to them', async () => {
			const authors = await getPublicAuthors(client)

			expect(authors).toHaveLength(1)
			expect(authors[0].id).toEqual(3)
		})

	})

	describe('findAuthorWithWorkId', () => {
		it('should return all authors with work id', async () => {
			const authors = await findAuthorWithWorkId(1, client)

			expect(authors.map(x => x.id)).toEqual([1, 2])
		})
	})

	describe('saveAuthor', () => {
		it('should save a author and save it into the reference table', async () => {
			const res = await saveAuthor(AUTHOR_NAME, AUTHOR_WORK_ID, client)

			const authors = await findAuthorWithWorkId(AUTHOR_WORK_ID, client)

			expect(authors).toHaveLength(1)
			expect(authors[0].name).toEqual(AUTHOR_NAME)
			expect(authors[0]).toEqual(res)
		})

		it('should return existing author if author already exists', async () => {
			const originalAuthor = await saveAuthor(AUTHOR_NAME, AUTHOR_WORK_ID, client)

			await expect(saveAuthor(AUTHOR_NAME, AUTHOR_WORK_ID, client)).resolves.toMatchObject(originalAuthor)
		})
	})

	describe('removeAuthorFromWork', () => {
		it('should remove author from work', async () => {
			await removeAuthorFromWork('author_1', 1, client)
			const authors = await findAuthorWithWorkId(1, client)

			expect(authors.map(x => x.id)).toEqual([2])
		})
	})
})
