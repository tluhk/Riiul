import {authorsRepository, Author, User} from "@riiul/repository"

export async function getAuthors(user?: User): Promise<string[]> {
	let authors: Author[]

	if (user) {
		authors = await authorsRepository.getAuthors()
	} else {
		authors = await authorsRepository.getPublicAuthors()
	}

	return authors.map(t => t.name)
}
