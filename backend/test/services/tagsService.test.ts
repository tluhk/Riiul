import User from '../../src/types/User'
import tagDatabaseService from '../../src/database/services/tagDatabaseService'
import {getTags} from '../../src/services/tagsService'

describe('getTags', () => {
	let allTagsSpy: jest.SpyInstance
	let allTagsPublicSpy: jest.SpyInstance

	beforeEach(async () => {
		allTagsSpy = jest.spyOn(tagDatabaseService, 'allTags').mockReturnValue(Promise.resolve([]))
		allTagsPublicSpy = jest.spyOn(tagDatabaseService, 'allTagsPublic').mockReturnValue(Promise.resolve([]))

	})

	it('should return only public tags when user is not set', async () => {
		await getTags()

		expect(allTagsSpy).not.toHaveBeenCalled()
		expect(allTagsPublicSpy).toHaveBeenCalled()
	})

	it('should return all tags when user is set', async () => {
		await getTags({} as User)

		expect(allTagsSpy).toHaveBeenCalled()
		expect(allTagsPublicSpy).not.toHaveBeenCalled()
	})
})
