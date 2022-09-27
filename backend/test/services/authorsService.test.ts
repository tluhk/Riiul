import User from '../../src/types/User'
import authorDatabaseService from '../../src/database/services/authorDatabaseService'
import {getAuthors} from '../../src/services/authorsService'

describe('getAuthors', () => {
	let allAuthorsSpy: jest.SpyInstance
	let allAuthorsPublicSpy: jest.SpyInstance

	beforeEach(async () => {
		allAuthorsSpy = jest.spyOn(authorDatabaseService, 'allAuthors')
			.mockReturnValue(Promise.resolve([]))

		allAuthorsPublicSpy = jest.spyOn(authorDatabaseService, 'allAuthorsPublic')
			.mockReturnValue(Promise.resolve([]))

	})

	it('should return only public authors when user is not set', async () => {
		await getAuthors()

		expect(allAuthorsSpy).not.toHaveBeenCalled()
		expect(allAuthorsPublicSpy).toHaveBeenCalled()
	})

	it('should return public and private authors when user is set', async () => {
		await getAuthors({} as User)

		expect(allAuthorsSpy).toHaveBeenCalled()
		expect(allAuthorsPublicSpy).not.toHaveBeenCalled()
	})
})
