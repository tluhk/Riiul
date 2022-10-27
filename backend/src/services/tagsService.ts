import {tagsRepository, Tag, User} from "@riiul/repository"

export async function getTags(user?: User): Promise<string[]> {
	let tags: Tag[]

	if (user) {
		tags = await tagsRepository.getTags()
	} else {
		tags = await tagsRepository.getPublicTags()
	}

	return tags.map(t => t.name)
}
