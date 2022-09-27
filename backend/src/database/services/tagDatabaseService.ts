import {query} from './databaseService'
import {PoolClient} from 'pg'
import Tag from '../../types/Tag'
import tagMapper from '../mappers/tagMapper'
import TagDatabaseType from '../types/TagDatabaseType'

async function allTags(client?: PoolClient): Promise<Tag[]> {
	const res = await query<TagDatabaseType>('SELECT * FROM tags ORDER BY id desc', [], client)

	return res.rows.map(tagMapper)
}

async function allTagsPublic(client?: PoolClient): Promise<Tag[]> {
	const res = await query<TagDatabaseType>(
		`SELECT DISTINCT t.id, t.name, t.updated_at, t.created_at FROM tags_in_work as tip
			RIGHT JOIN works as w ON w.id = tip.work_id
			RIGHT JOIN tags t on t.id = tip.tag_id
			WHERE w.active = true
			ORDER BY t.id desc`,
		[],
		client)

	return res.rows.map(tagMapper)
}

async function findWithWorkId(workId: number, client?: PoolClient): Promise<Tag[]> {
	const res = await query<TagDatabaseType>(
		`SELECT t.* FROM tags_in_work as tiw
			RIGHT JOIN tags t on tiw.tag_id = t.id
			WHERE tiw.work_id = $1`,
		[workId],
		client
	)

	return res.rows.map(tagMapper)
}

async function saveTag(tagName: string, workId: number, client?: PoolClient): Promise<Tag> {
	const { rows: tags } = await query<TagDatabaseType>(
		`INSERT INTO tags (name) VALUES ($1)
			ON CONFLICT ON CONSTRAINT tags_name_key
			DO UPDATE set name = $1 RETURNING *`,
		[tagName],
		client
	)

	await query(
		`INSERT INTO tags_in_work (work_id, tag_id) VALUES ($1, $2)
		ON CONFLICT ON CONSTRAINT tags_in_work_uniq_work_id_tag_id
		DO NOTHING`,
		[workId, tags[0].id],
		client)

	return tagMapper(tags[0])
}

async function removeTagFromWork(name: string, workId: number, client?: PoolClient): Promise<void> {
	await query(
		`DELETE FROM tags_in_work WHERE work_id = $1 AND tag_id = (
			SELECT id FROM tags WHERE name = $2
		)`,
		[workId, name],
		client
	)
}

export default {
	allTags,
	allTagsPublic,
	findWithWorkId,
	saveTag,
	removeTagFromWork
}
