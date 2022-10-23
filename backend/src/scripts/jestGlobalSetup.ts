// noinspection ES6PreferShortImport

import {begin, commit, query, rollback} from '../database/shared'
import bcrypt from 'bcrypt'
import {PoolClient} from "pg"
import {WorkExternalLinkEnum} from "../database/enums";

const CRAFT_TECHNOLOGIES_AND_DESIGN_ID = 1
const APPLIED_INFORMATICS_ID = 2
const TRAFFIC_SAFETY_ID = 3
const HEALTH_MANAGER_ID = 4

const AUTHORS = [
	{
		id: 1,
		name: 'author_1'
	},
	{
		id: 2,
		name: 'author_2'
	},
	{
		id: 3,
		name: 'author_3'
	},
	{
		id: 4,
		name: 'author_4'
	}
]

const TAGS = [
	{
		id: 1,
		name: 'tag_1'
	},
	{
		id: 2,
		name: 'tag_3'
	},
	{
		id: 3,
		name: 'tag_2'
	},
	{
		id: 4,
		name: 'tag_4'
	}
]

const WORKS = [
	{
		id: 1,
		subjectId: APPLIED_INFORMATICS_ID,
		title: "work_1",
		description: "work_1_desc",
		priority: false,
		active: false
	},
	{
		id: 2,
		subjectId: CRAFT_TECHNOLOGIES_AND_DESIGN_ID,
		title: "work_2 search_term",
		description: "work_2_desc",
		priority: false,
		active: true
	},
	{
		id: 3,
		subjectId: HEALTH_MANAGER_ID,
		title: "work_3",
		description: "work_3_desc search_term",
		priority: false,
		active: true
	}
]

const FILES = [
	{
		id: 1,
		workId: WORKS[0].id,
		workOrder: 0,
		name: 'uuid-original-name-1',
		extension: 'pdf',
		originalName: 'original-name-1.pdf'
	},
	{
		id: 2,
		workId: WORKS[1].id,
		workOrder: 0,
		name: 'uuid-original-name-2',
		extension: 'pdf',
		originalName: 'original-name-2.pdf'
	},
	{
		id: 3,
		workId: WORKS[1].id,
		workOrder: 1,
		name: 'uuid-original-name-3',
		extension: 'pdf',
		originalName: 'original-name-3.pdf'
	}
]

const WORK_AUTHOR_REF = [
	{ authorId: AUTHORS[0].id, workId: WORKS[0].id },
	{ authorId: AUTHORS[1].id, workId: WORKS[0].id },
	{ authorId: AUTHORS[2].id, workId: WORKS[2].id }
]

const WORK_TAG_REF = [
	{ tagId: TAGS[0].id, workId: WORKS[0].id },
	{ tagId: TAGS[1].id, workId: WORKS[0].id },
	{ tagId: TAGS[3].id, workId: WORKS[2].id }
]

const WORK_EXTERNAL_LINKS = [
	{
		id: 1,
		title: "youtube_url_1",
		link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		type: WorkExternalLinkEnum.YOUTUBE,
		workId: WORKS[0].id
	},
	{
		id: 2,
		title: "external_link_2",
		link: 'https://www.err.ee/',
		type: WorkExternalLinkEnum.EXTERNAL,
		workId: WORKS[0].id
	},
	{
		id: 3,
		title: "external_link_3",
		link: 'http://riiul.hk.tlu.ee',
		type: WorkExternalLinkEnum.EXTERNAL,
		workId: WORKS[1].id
	}
]

async function jestGlobalSetup(): Promise<void> {
	const client = await begin()

	try {
		await setUsers(client)
		await setAuthors(client)
		await setTags(client)
		await setWorks(client)
		await setWorkExternalLinks(client)
		await setFiles(client)

		await commit(client)
	} catch (e) {
		await rollback(client)

		throw e
	}
}

async function setUsers(client: PoolClient) {
	const password = await bcrypt.hash('test_password', parseInt(process.env.SALT_ROUNDS))

	await query('INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
		[1, 'test_username', 'test.test@gmail.com', password],
		client)

	await query('SELECT setval(\'users_id_seq\', (SELECT MAX(id) FROM users) + 1)', null, client)
}

async function setAuthors(client: PoolClient) {
	await Promise.all(AUTHORS.map(async (author) => query(
		'INSERT INTO authors (id, name) VALUES ($1, $2)',
		[author.id, author.name], client
	)))

	await query(`SELECT setval('authors_id_seq', (SELECT MAX(id) FROM authors) + $1)`, [AUTHORS.length + 1] ,client)
}

async function setTags(client: PoolClient) {
	await Promise.all(TAGS.map(async (tag) => query(
		'INSERT INTO tags (id, name) VALUES ($1, $2)',
		[tag.id, tag.name], client
	)))

	await query(`SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags) + $1)`, [TAGS.length + 1] ,client)
}

async function setWorks(client: PoolClient) {
	await Promise.all(WORKS.map(async (work) => query(
			'INSERT INTO works (id, subject_id, title, description, priority, active) VALUES ($1, $2, $3, $4, $5, $6)',
			[work.id, work.subjectId, work.title, work.description, work.priority, work.active], client)
	))

	await query(`SELECT setval(\'portfolios_id_seq\', (SELECT MAX(id) FROM works) + $1)`, [WORKS.length + 1], client)

	await Promise.all(WORK_AUTHOR_REF.map(async (data) => query(
		'INSERT INTO authors_in_work (author_id, work_id) VALUES ($1, $2)',
		[data.authorId, data.workId], client)
	))

	await Promise.all(WORK_TAG_REF.map(async (data) => query(
		'INSERT INTO tags_in_work (tag_id, work_id) VALUES ($1, $2) RETURNING *',
		[data.tagId, data.workId], client)
	))
}

async function setWorkExternalLinks(client: PoolClient) {
	await Promise.all(WORK_EXTERNAL_LINKS.map(
		async (externalLink) => query(
			'INSERT INTO work_external_links (id, title, link, type, work_id) VALUES ($1, $2, $3, $4, $5)',
			[externalLink.id, externalLink.title, externalLink.link, externalLink.type, externalLink.workId],
			client
		)
	))

	await query(`SELECT setval('portfolio_external_links_id_seq', (SELECT MAX(id) FROM tags) + $1)`, [TAGS.length + 1] ,client)
}

async function setFiles(client: PoolClient) {
	await Promise.all(FILES.map(async (file) => query(
		'INSERT INTO files (id, work_id, work_order, name, extension, original_name) VALUES ($1, $2, $3, $4, $5, $6)',
		[file.id, file.workId, file.workOrder, file.name, file.extension, file.originalName], client)
	))

	await query(`SELECT setval(\'files_id_seq\', (SELECT MAX(id) FROM files) + $1)`, [FILES.length + 1], client)
}

export default jestGlobalSetup
