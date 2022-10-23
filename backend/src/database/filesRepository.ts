import {File} from './models'
import {query} from './shared'
import HttpErrorNotFound from '../errors/HttpErrorNotFound'
import {PoolClient} from 'pg'

export async function findFileWithNameAndExtension(name: string, extension: string, client?: PoolClient): Promise<File | null> {
	const { rows } = await query<File>(
		'SELECT * FROM files WHERE extension = $1 AND name = $2',
		[extension, name],
		client
	)

	return rows[0] || null
}

export async function findFilesWithWorkId(workIds: number[], client?: PoolClient): Promise<File[]> {
	const { rows } = await query<File>(
		'SELECT * FROM files WHERE work_id = ANY($1::int[]) ORDER BY work_order',
		[workIds],
		client
	)

	return rows
}

export async function saveFile(file: Partial<File>, client?: PoolClient): Promise<File> {
	const { rows } = await query<File>(
		'INSERT INTO files (name, extension, original_name, work_id, work_order, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[file.name, file.extension, file.originalName, file.workId, file.workOrder, file.type],
		client)

	return rows[0]
}

export async function deleteFile(id: number, client?: PoolClient): Promise<void> {
	const res = await query('DELETE FROM files WHERE id = $1', [id], client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('FILE_NOT_FOUND')
}

export async function updateFile(id: number, order: number, client: PoolClient): Promise<File> {
	const res = await query<File>('UPDATE files SET work_order = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
		[id, order],
		client)

	if (res.rowCount === 0) throw new HttpErrorNotFound('FILE_NOT_FOUND')

	return res.rows[0]
}
