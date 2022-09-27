import User from '../types/User'
import Tag from '../types/Tag'
import tagDatabaseService from '../database/services/tagDatabaseService'

export async function getTags(user?: User): Promise<string[]> {
	let tags: Tag[]

	if (user) {
		tags = await tagDatabaseService.allTags()
	} else {
		tags = await tagDatabaseService.allTagsPublic()
	}

	return tags.map(t => t.name)
}
