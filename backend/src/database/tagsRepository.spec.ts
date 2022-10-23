import {begin, rollback} from './shared'
import {PoolClient} from 'pg'
import {findTagsWithWorkId, getPublicTags, getTags, removeTagFromWork, saveTag} from "./tagsRepository";

describe('tagsRepository', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterEach(async () => {
		await rollback(client)
	})

	describe('allTags', () => {
		it('should return all tags', async () => {
			const keywords = await getTags(client)

			expect(keywords).toHaveLength(4)
		})
	})

	describe('allPublicTags', () => {
		it('should return all tags that have a public work', async () => {
			const keywords = await getPublicTags(client)

			expect(keywords).toHaveLength(1)
		})
	});

	describe('findWithWorksId', () => {
		it('should return all tags with work id', async () => {
			const keywords = await findTagsWithWorkId(1, client)

			expect(keywords).toHaveLength(2)
			expect(keywords.map(x => x.id)).toMatchObject([1, 2])
		})
	})

	describe('saveTag', () => {
		it('should save a tag and save it into the reference table', async () => {
			const res = await saveTag('SAVE_TAG_1', 1, client)
			const keywords = await findTagsWithWorkId(1, client)

			expect(res.createdAt).toBeDefined()
			expect(res.updatedAt).toBeDefined()
			expect(keywords.length).toEqual(3)
			expect(keywords.map(x => x.id)).toMatchObject([1, 2, res.id])
			expect(keywords.find(x => x.id === res.id)).toMatchObject(res)
		})

		it('should return existing tag if tag already exists', async () => {
			const res = await saveTag("SAVE_TAG_1", 2, client)

			await expect(saveTag("SAVE_TAG_1", 1, client))
				.resolves.toMatchObject(res)
		})

		it('should return existing tag if tag and tag, work reference already exists', async () => {
			const res = await saveTag("SAVE_TAG_1", 2, client)

			await expect(saveTag("SAVE_TAG_1", 2, client))
				.resolves.toMatchObject(res)
		})
	})

	describe('removeTagFromWork', () => {
		it('should remove tag from work', async () => {
			let res = await findTagsWithWorkId(3, client)
			expect(res.length).toEqual(1)

			await removeTagFromWork("tag_4", 3 , client)

			res = await findTagsWithWorkId(3, client)
			expect(res.length).toEqual(0)
		})
	})
})
