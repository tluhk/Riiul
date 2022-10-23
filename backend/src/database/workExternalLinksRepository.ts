import {query} from './shared'
import {PoolClient} from 'pg'
import {WorkExternalLink} from './models'

export async function findWorkExternalLinksWithWorkId(workId: number, client?: PoolClient): Promise<WorkExternalLink[]> {
	const {rows} = await query<WorkExternalLink>(
		'SELECT pel.* FROM work_external_links as pel WHERE pel.work_id IN ($1)',
		[workId],
		client
	)

	return rows
}

export async function findVideosWithWorkIds(workId: number[], client?: PoolClient): Promise<WorkExternalLink[]> {
	const {rows} = await query<WorkExternalLink>(
		'SELECT wel.* FROM work_external_links as wel WHERE wel.type = \'YOUTUBE\' AND wel.work_id = ANY($1::int[])',
		[workId],
		client
	)

	return rows
}

export async function deleteWorkExternalLink(id: number, client?: PoolClient): Promise<void> {
	await query('DELETE FROM work_external_links WHERE id = $1', [id], client)
}

export async function saveWorkExternalLink(workId: number, {title, link, type}: Partial<WorkExternalLink>, client?: PoolClient): Promise<WorkExternalLink> {
	const {rows} = await query<WorkExternalLink>(
		`INSERT INTO work_external_links (title, link, type, work_id) VALUES ($1, $2, $3, $4)
		ON CONFLICT ON CONSTRAINT work_external_links_uniq_work_id_type
		DO UPDATE set title = $1, link = $2 RETURNING *`,
		[title, link, type, workId],
		client)

	return rows[0]
}
