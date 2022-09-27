import request from 'supertest'
import app from '../../src/app'
import * as faker from 'faker'
import {begin, commit, query, rollback} from '../../src/database/services/databaseService'
import {generateJwtToken} from '../../src/services/authenticateService'
import SubjectDatabaseType from '../../src/database/types/SubjectDatabaseType'
import tagDatabaseService from '../../src/database/services/tagDatabaseService'
import authorDatabaseService from '../../src/database/services/authorDatabaseService'
import {PoolClient} from 'pg'
import WORK_EXTERNAL_LINK from '../../src/enums/WORK_EXTERNAL_LINK'
import workExternalLinksDatabaseService from '../../src/database/services/workExternalLinksDatabaseService'

describe('find one work', () => {
	let client: PoolClient

	const ALL_WORKS = [
		{
			title: faker.random.word(),
			subjectId: 2,
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at',
			priority: false,
			active: true,
			tags: ['tag3', 'tag1', 'tag2'],
			authors: ['author3', 'author1', 'author2'],
			externalLinks: [
				{
					title: faker.random.word(),
					link: faker.internet.url(),
					type: WORK_EXTERNAL_LINK.EXTERNAL
				}
			]
		},
		{
			title: faker.random.word(),
			subjectId: 3,
			description: 'Title2Lorem ipsum dolor sit amet, consectetur adipisTitle2cing elit. Phasellus at',
			priority: false,
			active: false,
			tags: ['tag2'],
			authors: ['author1', 'author2'],
			externalLinks: [
				{
					title: faker.random.word(),
					link: faker.internet.url(),
					type: WORK_EXTERNAL_LINK.EXTERNAL
				},
				{
					title: faker.random.word(),
					link: faker.internet.url(),
					type: WORK_EXTERNAL_LINK.YOUTUBE
				}
			]
		},
		{
			title: faker.random.words(2),
			subjectId: 3,
			description: 'Title2Lorem ipsum dolor sit amet, consectetur adipisTitle2cing elit. Phasellus at',
			priority: false,
			active: false,
			tags: ['tag2'],
			authors: ['author2'],
			externalLinks: [
				{
					title: faker.random.word(),
					link: faker.internet.url(),
					type: WORK_EXTERNAL_LINK.EXTERNAL
				}
			]
		}
	]

	const workIds: number[] = []
	const tagIds: number[] = []
	const authorIds: number[] = []
	const externalLinkIds: number[] = []

	beforeAll(async () => {
		try {
			client = await begin()

			for (const work of ALL_WORKS) {
				const {title, subjectId, description, priority, active, tags, authors, externalLinks} = work
				const { rows } = await query<SubjectDatabaseType>(
					'INSERT INTO works (title, subject_id, description, priority, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
					[title, subjectId, description, priority, active],
					client)

				workIds.push(rows[0].id)

				for (const tag of tags) {
					const {id} = await tagDatabaseService.saveTag(tag, rows[0].id, client)
					tagIds.push(id)
				}
				for (const author of authors) {
					const {id} = await authorDatabaseService.saveAuthor(author, rows[0].id, client)
					authorIds.push(id)
				}
				for (const externalLink of externalLinks) {
					const {id} = await workExternalLinksDatabaseService.saveWorkExternalLink(rows[0].id, externalLink, client)
					externalLinkIds.push(id)
				}
			}

			await commit(client)
		} catch (e) {
			await rollback(client)
			throw e
		}
	})

	afterAll(async () => {
		await query(`DELETE FROM works WHERE id IN (${workIds.join(', ')})`, [])
		await query(`DELETE FROM tags WHERE id IN (${tagIds.join(', ')})`, [])
		await query(`DELETE FROM authors WHERE id IN (${authorIds.join(', ')})`, [])
		await query(`DELETE FROM work_external_links WHERE id IN (${externalLinkIds.join(', ')})`, [])
	})

	it('should return 200 when looking for active work, while logged in', async () => {
		const response = await request(app)
			.get(`/works/${ALL_WORKS[1].title}`)
			.set('Authorization', generateJwtToken(1))

		expect(response.statusCode).toBe(200)
		expect(response.body).toMatchObject(ALL_WORKS[1])
	})

	it('should return 200 when looking for private work, while logged in', async () => {
		const response = await request(app)
			.get(`/works/${ALL_WORKS[1].title}`)
			.set('Authorization', generateJwtToken(1))

		expect(response.statusCode).toBe(200)
		expect(response.body).toMatchObject(ALL_WORKS[1])
	})

	it('should return 200 when looking for a active work while not logged in', async () => {
		const response = await request(app)
			.get(`/works/${ALL_WORKS[0].title}`)

		delete ALL_WORKS[0].active

		expect(response.statusCode).toBe(200)
		expect(response.body).toMatchObject(ALL_WORKS[0])
	})

	it('should return 404 when looking for a private work while not logged in', async () => {
		const response = await request(app)
			.get(`/works/${ALL_WORKS[1].title}`)

		expect(response.statusCode).toBe(404)
		expect(response.body).toStrictEqual({
			status: 404,
			message: 'WORK_NOT_FOUND'
		})
	})

	it('should respond with 404 error when work doesn\'t exist', async () => {
		const response = await request(app)
			.get('/works/not-existing-work')
			.set('Authorization', generateJwtToken(1))

		expect(response.statusCode).toBe(404)
		expect(response.body).toStrictEqual({
			status: 404,
			message: 'WORK_NOT_FOUND'
		})
	})
})
