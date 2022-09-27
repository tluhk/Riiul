import AuthorDatabaseType from '../types/AuthorDatabaseType'
import Author from '../../types/Author'

function authorMapper(author?: AuthorDatabaseType): Author | null {
	if (!author) return null

	const newAuthor: Author & AuthorDatabaseType = { ...author }

	delete newAuthor.created_at
	delete newAuthor.updated_at

	return {
		...newAuthor
	}
}

export default authorMapper
