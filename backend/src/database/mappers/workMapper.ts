import {DateTime} from 'luxon'
import WorkDatabaseType from '../types/WorkDatabaseType'
import Work from '../../types/Work'

function workMapper(databaseFile?: WorkDatabaseType): Work | null {
	if (!databaseFile) return null

	const work = { ...databaseFile }
	delete work.created_at
	delete work.updated_at
	delete work.subject_id
	delete work.graduation_year
	delete work.is_video_preview_image

	return {
		...work,
		graduationYear: databaseFile.graduation_year,
		subjectId: databaseFile.subject_id,
		createdAt: DateTime.fromJSDate(databaseFile.created_at),
		updatedAt: DateTime.fromJSDate(databaseFile.updated_at),
		isVideoPreviewImage: databaseFile.is_video_preview_image,
	}
}

export default workMapper
