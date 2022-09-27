import {begin, query, rollback} from '../../../src/database/services/databaseService'
import {PoolClient} from 'pg'
import faker from 'faker'
import WorkDatabaseType from '../../../src/database/types/WorkDatabaseType'
import workExternalLinksDatabaseService from '../../../src/database/services/workExternalLinksDatabaseService'
import WorkExternalLink from '../../../src/types/WorkExternalLink'
import WorkExternalLinkDatabaseType from '../../../src/database/types/WorkExternalLinkDatabaseType'
import WORK_EXTERNAL_LINK from '../../../src/enums/WORK_EXTERNAL_LINK'

let client: PoolClient
let externalLinks: (WorkExternalLink)[]
let worksIds: number[]

beforeEach(async () => {
	client = await begin()

	const worksData = [
		1, faker.random.word(), faker.random.word(), false, true,
		1, faker.random.word(), faker.random.word(), false, true
	]

	const { rows: works } = await query<WorkDatabaseType>(
		'INSERT INTO works (subject_id, title, description, priority, active) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10) RETURNING *',
		worksData,
		client)

	worksIds = works.map(x => x.id)

	const externalLinksData = [
		faker.random.word().substring(0, 16), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', WORK_EXTERNAL_LINK.YOUTUBE, worksIds[0],
		faker.random.word().substring(0, 16), faker.internet.url(), WORK_EXTERNAL_LINK.EXTERNAL, worksIds[0],
		faker.random.word().substring(0, 16), faker.internet.url(), WORK_EXTERNAL_LINK.EXTERNAL, worksIds[1]
	]

	const { rows: externalLinksDatabase } = await query<WorkExternalLinkDatabaseType>(
		`INSERT INTO work_external_links (title, link, type, work_id) VALUES
        	($1, $2, $3, $4),
			($5, $6, $7, $8),
            ($9, $10, $11, $12)
            RETURNING *`,
		externalLinksData, client)

	externalLinks = externalLinksDatabase.map(x => ({
		id: x.id,
		title: x.title,
		link: x.link,
		type: x.type
	}))
})

afterEach(async () => {
	await rollback(client)
})

it('should delete external links, when deleting work', async () => {
	await query('DELETE FROM works WHERE id = $1', [worksIds[0]], client)

	const links = await workExternalLinksDatabaseService
		.findWithWorkId(worksIds[0], client)

	expect(links).toHaveLength(0)
})

describe('findWithWorksId', () => {
	it('should return all work external links with work id', async () => {
		const links = await workExternalLinksDatabaseService
			.findWithWorkId(worksIds[0], client)

		expect(links).toHaveLength(2)
		expect(links).toEqual([ externalLinks[0], externalLinks[1] ])
	})
})

describe('deleteWorkExternalLinks', () => {
	it('should delete all work external links', async () => {
		await workExternalLinksDatabaseService
			.deleteWorkExternalLink(externalLinks[2].id, client)

		const links = await workExternalLinksDatabaseService
			.findWithWorkId(worksIds[1], client)

		expect(links).toHaveLength(0)
	})
})

describe('saveWorkExternalLinks', () => {
	it('should save all work external links', async () => {
		const link = {
			title: faker.random.word(),
			link: faker.internet.url(),
			type: WORK_EXTERNAL_LINK.YOUTUBE
		}

		const savedLink = await workExternalLinksDatabaseService
			.saveWorkExternalLink(worksIds[1], link, client)

		expect(savedLink).toMatchObject(link)

		const links = await workExternalLinksDatabaseService
			.findWithWorkId(worksIds[1], client)

		expect(links).toHaveLength(2)
		expect(links).toEqual([externalLinks[2], savedLink])
	})

	it('should overwrite existing external link, if link with type for work already exists', async () => {
		const link = {
			title: faker.random.word(),
			link: faker.internet.url(),
			type: WORK_EXTERNAL_LINK.EXTERNAL
		}

		const savedLink = await workExternalLinksDatabaseService
			.saveWorkExternalLink(worksIds[1], link, client)

		expect(savedLink).toMatchObject(link)

		const links = await workExternalLinksDatabaseService
			.findWithWorkId(worksIds[1], client)

		expect(links).toHaveLength(1)
		expect(links).toEqual([savedLink])
	})
})
