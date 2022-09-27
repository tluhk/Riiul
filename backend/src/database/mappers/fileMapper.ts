import {DateTime} from 'luxon'
import File from '../../types/File'
import FileDatabaseType from '../types/FileDatabaseType'

function fileMapper(databaseFile?: FileDatabaseType): File | null {
	if (!databaseFile) return null

	const file = { ...databaseFile }
	delete file.created_at
	delete file.updated_at
	delete file.original_name
	delete file.work_id
	delete file.work_order

	return {
		...file,
		workId: databaseFile.work_id,
		workOrder: databaseFile.work_order,
		originalName: databaseFile.original_name,
		createdAt: DateTime.fromJSDate(databaseFile.created_at),
		updatedAt: DateTime.fromJSDate(databaseFile.updated_at)
	}
}

export default fileMapper
