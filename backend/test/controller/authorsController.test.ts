import request from 'supertest'
import app from '../../src/app'
import {generateJwtToken} from '../../src/services/authenticateService'
import { query} from '../../src/database/services/databaseService'
import AuthorDatabaseType from '../../src/database/types/AuthorDatabaseType'
import faker from 'faker'
import WorkDatabaseType from '../../src/database/types/WorkDatabaseType'

let authors: AuthorDatabaseType[]
let works: WorkDatabaseType[]

const authorRawData = [
	[faker.name.firstName() + '_1'],
	[faker.name.firstName() + '_2'],
	[faker.name.firstName() + '_3'],
	[faker.name.firstName() + '_4'],
]

beforeAll(async () => {
	authors = await Promise.all(authorRawData.map(async (data) => {
		const res = await query<AuthorDatabaseType>(
			'INSERT INTO authors (name) VALUES ($1) RETURNING *',
			data)

		return res.rows[0]
	}))

	const workRawData = [
		[1, faker.random.word(), faker.random.word(), 'false', 'true'],
		[1, faker.random.word(), faker.random.word(), 'false', 'false'],
		[1, faker.random.word(), faker.random.word(), 'false', 'true']
	]

	works = await Promise.all(workRawData.map(async (data) => {
		const res = await query<WorkDatabaseType>(
			'INSERT INTO works (subject_id, title, description, priority, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			data)

		return res.rows[0]
	}))

	const refData = [
		[authors[0].id, works[0].id],
		[authors[2].id, works[0].id],
		[authors[0].id, works[2].id],
		[authors[3].id, works[1].id],
	]

	await Promise.all(refData.map(async (data) => await query(
		'INSERT INTO authors_in_work (author_id, work_id) VALUES ($1, $2) RETURNING *',
		data)
	))
})

afterAll(async () => {
	await query(
		'DELETE FROM authors where id = ANY($1::int[])',
		[authors.map(tag => tag.id)]
	)

	await query(
		'DELETE FROM works where id = ANY($1::int[])',
		[works.map(work => work.id)]
	)
})

describe('get all authors', () => {
	it('should respond with all the authors, when logged in', async () => {
		const response = await request(app)
			.get('/authors')
			.set('Authorization', generateJwtToken(1))

		expect(response).toMatchObject({
			statusCode: 200,
			body: authors.sort(({id: a}, {id: b}) => b - a)
				.map(a => a.name)
		})
	})

	it('should respond with public authors, when not logged in', async () => {
		const response = await request(app)
			.get('/authors')

		expect(response).toMatchObject({ statusCode: 200 })

		expect(response.body).not.toContainEqual(authorRawData[1][0])
		expect(response.body).not.toContainEqual(authorRawData[3][0])
	})
})
