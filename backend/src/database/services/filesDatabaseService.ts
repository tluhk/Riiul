import File from '../../types/File'
import {query} from './databaseService'
import FileDatabaseType from '../types/FileDatabaseType'
import SaveFileType from '../types/SaveFileType'
import fileMapper from '../mappers/fileMapper'
import HttpErrorNotFound from '../../errors/HttpErrorNotFound'
import {PoolClient} from 'pg'

async function findWithNameAndExtension(name: string, extension: string, client?: PoolClient): Promise<File> {
	const res = await query<FileDatabaseType>(
		'SELECT * FROM files WHERE extension = $1 AND name = $2',
		[extension, name],
		client
	)

	return fileMapper(res.rows[0])
}

async function findWithWorksId(workIds: number[], client?: PoolClient): Promise<File[]> {
	const res = await query<FileDatabaseType>(
		'SELECT * FROM files WHERE work_id = ANY($1::int[]) ORDER BY work_order',
		[workIds],
		client
	)

	return res.rows.map(fileMapper)
}

async function save(file: SaveFileType, client?: PoolClient): Promise<File> {
	const res = await query<FileDatabaseType>(
		'INSERT INTO files (name, extension, original_name, work_id, work_order, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[file.name, file.extension, file.originalName, file.workId, file.workOrder, file.type],
		client)

	return fileMapper(res.rows[0])
}

async function deleteFile(id: number, client?: PoolClient): Promise<void> {
	const res = await query('DELETE FROM files WHERE id = $1', [id], client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('FILE_NOT_FOUND')
}

async function updateFile(id: number, order: number, client: PoolClient): Promise<File> {
	const res = await query<FileDatabaseType>('UPDATE files SET work_order = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
		[id, order],
		client)

	if (res.rowCount === 0) throw new HttpErrorNotFound('FILE_NOT_FOUND')

	return fileMapper(res.rows[0])
}

export default {
	findWithNameAndExtension,
	findWithWorksId,
	deleteFile,
	updateFile,
	save
}
