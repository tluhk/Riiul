import User from '../types/User'
import Author from '../types/Author'
import authorDatabaseService from '../database/services/authorDatabaseService'

export async function getAuthors(user?: User): Promise<string[]> {
	let authors: Author[]

	if (user) {
		authors = await authorDatabaseService.allAuthors()
	} else {
		authors = await authorDatabaseService.allAuthorsPublic()
	}

	return authors.map(t => t.name)
}
