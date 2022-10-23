import {query} from './shared'
import {PoolClient} from 'pg'
import {Author} from './models'

export async function getAuthors(client?: PoolClient): Promise<Author[]> {
	const { rows } = await query<Author>('SELECT * FROM authors ORDER BY id desc', [], client)

	return rows
}

export async function getPublicAuthors(client?: PoolClient): Promise<Author[]> {
	const { rows } = await query<Author>(
		`SELECT DISTINCT a.id, a.name, a.updated_at, a.created_at FROM authors_in_work as aip
			RIGHT JOIN works as w ON w.id = aip.work_id
			RIGHT JOIN authors a on a.id = aip.author_id
			WHERE w.active = true
			ORDER BY a.id desc`,
		[],
		client)

	return rows
}

export async function findAuthorWithWorkId(workId: number, client?: PoolClient): Promise<Author[]> {
	const { rows } = await query<Author>(
		`SELECT a.* FROM authors_in_work as aiw
			RIGHT JOIN authors a on aiw.author_id = a.id
			WHERE aiw.work_id = $1`,
		[workId],
		client
	)

	return rows
}

export async function saveAuthor(authorName: string, workId: number, client?: PoolClient): Promise<Author> {
	const { rows } = await query<Author>(
		`INSERT INTO authors (name) VALUES ($1)
			ON CONFLICT ON CONSTRAINT authors_name_key
			DO UPDATE set name = $1 RETURNING *`,
		[authorName],
		client
	)

	const author = rows[0]

	await query(
		`INSERT INTO authors_in_work (work_id, author_id) VALUES ($1, $2)
		ON CONFLICT ON CONSTRAINT authors_in_work_uniq_work_id_author_id
		DO NOTHING`,
		[workId, author.id],
		client)

	return author
}

export async function removeAuthorFromWork(name: string, workId: number, client?: PoolClient): Promise<void> {
	await query(
		`DELETE FROM authors_in_work WHERE work_id = $1 AND author_id = (
			SELECT id FROM authors WHERE name = $2
		)`,
		[workId, name],
		client
	)
}

