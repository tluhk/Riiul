import {DateTime} from 'luxon'
import Subject from '../../types/Subject'
import SubjectDatabaseType from '../types/SubjectDatabaseType'

function subjectMapper(databaseFile?: SubjectDatabaseType): Subject | null {
	if (!databaseFile) return null

	const file = { ...databaseFile }
	delete file.created_at
	delete file.updated_at

	return {
		...file,
		createdAt: DateTime.fromJSDate(databaseFile.created_at),
		updatedAt: DateTime.fromJSDate(databaseFile.updated_at)
	}
}

export default subjectMapper
