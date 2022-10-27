import {begin, rollback} from './shared'
import {PoolClient} from 'pg'
import {
	deleteWorkExternalLink, findVideosWithWorkIds,
	findWorkExternalLinksWithWorkId,
	saveWorkExternalLink
} from "./workExternalLinksRepository"
import {WorkExternalLinkEnum} from "./enums"

const VIDEO_EXTERNAL_LINK = {
	id: 1,
	title: "youtube_url_1",
	link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
	type: WorkExternalLinkEnum.YOUTUBE,
	workId: 1
}

const EXTERNAL_LINK = {
	id: 2,
	title: "external_link_2",
	link: 'https://www.err.ee/',
	type: WorkExternalLinkEnum.EXTERNAL,
	workId: 1
}

describe('workExternalLinksRepository', () => {
	let client: PoolClient

	beforeEach(async () => {
		client = await begin()
	})

	afterEach(async () => {
		await rollback(client)
	})

	describe('findWorkExternalLinksWithWorkId', () => {
		it('should return all work external links with work id', async () => {
			const links = await findWorkExternalLinksWithWorkId(1, client)

			expect(links).toHaveLength(2)
			expect(links).toMatchObject([VIDEO_EXTERNAL_LINK, EXTERNAL_LINK])
		})
	})

	describe('findVideosWithWorkIds', () => {
		it('should return all work external links with work id', async () => {
			const links = await findVideosWithWorkIds([1], client)

			expect(links).toHaveLength(1)
			expect(links).toMatchObject([VIDEO_EXTERNAL_LINK])
		})
	})

	describe('deleteWorkExternalLink', () => {
		it('should delete all work external links', async () => {
			await expect(findVideosWithWorkIds([1], client)).resolves.toHaveLength(1)
			await deleteWorkExternalLink(VIDEO_EXTERNAL_LINK.id, client)
			await expect(findVideosWithWorkIds([1], client)).resolves.toHaveLength(0)
		})
	})

	describe('saveWorkExternalLink', () => {
		it('should save all work external links', async () => {
			const link = {
				title: "external link",
				link: "hk.tlu.ee",
				type: WorkExternalLinkEnum.YOUTUBE
			}

			const savedLink = await saveWorkExternalLink(3, link, client)

			expect(savedLink).toMatchObject(link)

			const links = await findWorkExternalLinksWithWorkId(3, client)

			expect(links).toHaveLength(1)
			expect(links).toEqual([savedLink])
		})

		it('should overwrite existing external link, if link with type for work already exists', async () => {
			const link = {
				title: "new link",
				link: "new link url",
				type: WorkExternalLinkEnum.EXTERNAL
			}

			const savedLink = await saveWorkExternalLink(1, link, client)

			expect(savedLink).toMatchObject(link)

			const links = await findWorkExternalLinksWithWorkId(1, client)

			expect(links).toHaveLength(2)
			expect(links).toContainEqual(savedLink)
		})
	})
})
