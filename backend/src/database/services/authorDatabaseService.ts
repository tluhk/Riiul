import {query} from './databaseService'
import {PoolClient} from 'pg'
import Author from '../../types/Author'
import AuthorDatabaseType from '../types/AuthorDatabaseType'
import authorMapper from '../mappers/authorMapper'

async function allAuthors(client?: PoolClient): Promise<Author[]> {
	const res = await query<AuthorDatabaseType>('SELECT * FROM authors ORDER BY id desc', [], client)

	return res.rows.map(authorMapper)
}

async function allAuthorsPublic(client?: PoolClient): Promise<Author[]> {
	const res = await query<AuthorDatabaseType>(
		`SELECT DISTINCT a.id, a.name, a.updated_at, a.created_at FROM authors_in_work as aip
			RIGHT JOIN works as w ON w.id = aip.work_id
			RIGHT JOIN authors a on a.id = aip.author_id
			WHERE w.active = true
			ORDER BY a.id desc`,
		[],
		client)

	return res.rows.map(authorMapper)
}

async function findWithWorkId(workId: number, client?: PoolClient): Promise<Author[]> {
	const res = await query<AuthorDatabaseType>(
		`SELECT a.* FROM authors_in_work as aiw
			RIGHT JOIN authors a on aiw.author_id = a.id
			WHERE aiw.work_id = $1`,
		[workId],
		client
	)

	return res.rows.map(authorMapper)
}

async function saveAuthor(authorName: string, workId: number, client?: PoolClient): Promise<Author> {
	const { rows: authors } = await query<AuthorDatabaseType>(
		`INSERT INTO authors (name) VALUES ($1)
			ON CONFLICT ON CONSTRAINT authors_name_key
			DO UPDATE set name = $1 RETURNING *`,
		[authorName],
		client
	)

	await query(
		`INSERT INTO authors_in_work (work_id, author_id) VALUES ($1, $2)
		ON CONFLICT ON CONSTRAINT authors_in_work_uniq_work_id_author_id
		DO NOTHING`,
		[workId, authors[0].id],
		client)

	return authorMapper(authors[0])
}

async function removeAuthorFromWork(name: string, workId: number, client?: PoolClient): Promise<void> {
	await query(
		`DELETE FROM authors_in_work WHERE work_id = $1 AND author_id = (
			SELECT id FROM tags WHERE name = $2
		)`,
		[workId, name],
		client
	)
}

export default {
	allAuthors,
	allAuthorsPublic,
	findWithWorkId,
	saveAuthor,
	removeAuthorFromWork
}
