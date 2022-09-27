import TagDatabaseType from '../types/TagDatabaseType'
import Tag from '../../types/Tag'

function tagMapper(tag?: TagDatabaseType): Tag | null {
	if (!tag) return null

	const newTag: Tag & TagDatabaseType = { ...tag }

	delete newTag.created_at
	delete newTag.updated_at

	return {
		...newTag
	}
}

export default tagMapper
