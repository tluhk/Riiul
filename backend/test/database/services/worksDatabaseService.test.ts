import {PoolClient} from 'pg'
import {begin, query, rollback} from '../../../src/database/services/databaseService'
import SubjectDatabaseType from '../../../src/database/types/SubjectDatabaseType'
import worksDatabaseService from '../../../src/database/services/worksDatabaseService'
import tagDatabaseService from '../../../src/database/services/tagDatabaseService'
import authorDatabaseService from '../../../src/database/services/authorDatabaseService'

let client: PoolClient

const ALL_WORKS = [
	{
		title: 'Title1',
		subjectId: 2,
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at',
		priority: false,
		active: true,
		tags: ['tag1', 'tag2', 'tag3'],
		authors: ['author1', 'author2', 'author3']
	},
	{
		title: 'Title2',
		subjectId: 3,
		description: 'Title2Lorem ipsum dolor sit amet, consectetur adipisTitle2cing elit. Phasellus at',
		priority: false,
		active: false,
		tags: ['tag2'],
		authors: ['author1', 'author2']
	},
	{
		title: 'Title3',
		subjectId: 2,
		description: 'Lorem ipsum dolor sit amet, coTitle2nsectetur adipiscing elit. Phasellus at',
		priority: false,
		active: false,
		tags: ['tag5', 'tag2'],
		authors: ['author1', 'author3']
	},
	{
		title: 'Title4',
		subjectId: 1,
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at',
		priority: false,
		active: true,
		tags: ['tag1', 'tag3'],
		authors: ['author3']
	},
	{
		title: 'Title5',
		subjectId: 4,
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at',
		priority: false,
		active: true,
		tags: ['tag4', 'tag6'],
		authors: ['author1']
	}
]

beforeAll(async () => {
	client = await begin()

	await Promise.all(ALL_WORKS.map(
		async ({title, subjectId, description, priority, active, tags, authors}) => {
			const { rows } = await query<SubjectDatabaseType>(
				'INSERT INTO works (title, subject_id, description, priority, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
				[title, subjectId, description, priority, active],
				client)

			for (const tag of tags) {
				await tagDatabaseService.saveTag(tag, rows[0].id, client)
			}
			for (const author of authors) {
				await authorDatabaseService.saveAuthor(author, rows[0].id, client)
			}
		}))

})

afterAll(async () => {
	await rollback(client)
})

describe('findWorkWithTitle', () => {
	it('should return user when searching for an active user', async () => {

		const res = await worksDatabaseService.findWorkWithTitle('Title1', client)

		expect(res).toMatchObject({
			title: 'Title1',
			subjectId: 2,
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at',
			priority: false,
			active: true
		})
	})

	it('should return user when searching for an inactive user', async () => {

		const res = await worksDatabaseService.findWorkWithTitle('Title2', client)

		expect(res).toMatchObject({
			title: 'Title2',
			subjectId: 3,
			description: 'Title2Lorem ipsum dolor sit amet, consectetur adipisTitle2cing elit. Phasellus at',
			priority: false,
			active: false
		})
	})
})

describe('findWorkPublicWithTitle', () => {
	it('should return user when searching for an active user', async () => {

		const res = await worksDatabaseService.findWorkPublicWithTitle('Title1', client)

		expect(res).toMatchObject({
			title: 'Title1',
			subjectId: 2,
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at',
			priority: false,
			active: true
		})
	})

	it('should not return user when searching for an inactive user', async () => {

		await expect(worksDatabaseService.findWorkPublicWithTitle('Title2', client))
			.rejects.toMatchObject({ status: 404, message: 'WORK_NOT_FOUND' })
	})
})

describe('allWorksPublic', () => {
	it('should return all public works', async () => {
		const res = await worksDatabaseService.allWorksPublic(undefined, client)

		expect(res).toHaveLength(3)
	})

	it('should return all active works if params active is set true', async () => {
		const res = await worksDatabaseService.allWorksPublic({active: true}, client)

		expect(res).toHaveLength(3)
	})

	it('should return all active works if params active is set false', async () => {
		const res = await worksDatabaseService.allWorksPublic({active: false}, client)

		expect(res).toHaveLength(3)
	})
})

describe('allWorks', () => {
	it('should return all works', async () => {
		const res = await worksDatabaseService.allWorks(undefined, client)

		expect(res).toHaveLength(5)
	})

	it('should return all active works if params active is set true', async () => {
		const res = await worksDatabaseService.allWorks({active: true}, client)

		expect(res).toHaveLength(3)
	})

	it('should return all not active works if params active is set false', async () => {
		const res = await worksDatabaseService.allWorks({active: false}, client)

		expect(res).toHaveLength(2)
	})

	it('should return all active works with works "Rakendusinformaatika" and "Tervisejuht"', async () => {
		const res = await worksDatabaseService.allWorks({
			active: true,
			subjects: ['Rakendusinformaatika', 'Tervisejuht']
		}, client)

		expect(res).toHaveLength(2)
	})

	it('should return all works with tags "tag1" and "tag2"', async () => {
		const res = await worksDatabaseService.allWorks({
			tags: ['tag1', 'tag2']
		}, client)

		expect(res).toHaveLength(4)
	})

	it('should return all works with authors "author1" and "author2"', async () => {
		const res = await worksDatabaseService.allWorks({
			authors: ['author1', 'author2']
		}, client)

		expect(res).toHaveLength(4)
	})

	it('should return all works with word', async () => {
		const res = await worksDatabaseService.allWorks({
			q:'Title2'
		}, client)

		expect(res).toHaveLength(2)
	})
})
