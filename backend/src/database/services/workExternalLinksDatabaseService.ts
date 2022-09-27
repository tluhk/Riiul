import {query} from './databaseService'
import {PoolClient} from 'pg'
import WorkExternalLink from '../../types/WorkExternalLink'
import workExternalLinksMapper from '../mappers/workExternalLinksMapper'
import WorkExternalLinkDatabaseType from '../types/WorkExternalLinkDatabaseType'
import WorkExternalLinkSave from '../../types/WorkExternalLinkSave'

async function findWithWorkId(workId: number, client?: PoolClient): Promise<WorkExternalLink[]> {
	const res = await query<WorkExternalLinkDatabaseType>(
		'SELECT pel.* FROM work_external_links as pel WHERE pel.work_id IN ($1)',
		[workId],
		client
	)

	return res.rows.map(x => workExternalLinksMapper(x))
}

async function findVideosWithWorkIds(workId: number[], client?: PoolClient): Promise<WorkExternalLink[]> {
	const res = await query<WorkExternalLinkDatabaseType>(
		'SELECT wel.* FROM work_external_links as wel WHERE wel.type = \'YOUTUBE\' AND wel.work_id = ANY($1::int[])',
		[workId],
		client
	)

	return res.rows.map(x => workExternalLinksMapper(x, true))
}

async function deleteWorkExternalLink(id: number, client?: PoolClient): Promise<void> {
	await query('DELETE FROM work_external_links WHERE id = $1', [id], client)
}

async function saveWorkExternalLink(workId: number, {title, link, type}: WorkExternalLinkSave, client?: PoolClient): Promise<WorkExternalLink> {
	const res = await query<WorkExternalLinkDatabaseType>(
		`INSERT INTO work_external_links (title, link, type, work_id) VALUES ($1, $2, $3, $4)
		ON CONFLICT ON CONSTRAINT work_external_links_uniq_work_id_type
		DO UPDATE set title = $1, link = $2 RETURNING *`,
		[title, link, type, workId],
		client)

	return workExternalLinksMapper(res.rows[0])
}

export default {
	findVideosWithWorkIds,
	findWithWorkId,
	deleteWorkExternalLink,
	saveWorkExternalLink
}
