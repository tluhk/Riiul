import WorkExternalLinkDatabaseType from '../types/WorkExternalLinkDatabaseType'
import WorkExternalLink from '../../types/WorkExternalLink'

function workExternalLinksMapper(externalLink?: WorkExternalLinkDatabaseType, keepWorkId?: boolean): WorkExternalLink | null {
	if (!externalLink) return null

	const newTag = { ...externalLink }

	delete newTag.created_at
	delete newTag.updated_at
	delete newTag.work_id

	if (keepWorkId) {
		return {
			...newTag,
			workId: externalLink.work_id
		}
	}

	return newTag
}

export default workExternalLinksMapper
