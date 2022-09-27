import subjectDatabaseService from '../../src/database/services/subjectDatabaseService'
import {getSubjects} from '../../src/services/subjectsService'
import User from '../../src/types/User'

describe('getSubjects', () => {
	let allSubjectsSpy: jest.SpyInstance
	let allSubjectsPublicSpy: jest.SpyInstance

	beforeEach(async () => {
		allSubjectsSpy = jest.spyOn(subjectDatabaseService, 'allSubjects').mockReturnValue(Promise.resolve([]))
		allSubjectsPublicSpy = jest.spyOn(subjectDatabaseService, 'allSubjectsPublic').mockReturnValue(Promise.resolve([]))

	})

	it('should return only public subjects when user is not set', async () => {
		await getSubjects()

		expect(allSubjectsSpy).not.toHaveBeenCalled()
		expect(allSubjectsPublicSpy).toHaveBeenCalled()
	})

	it('should return public and private subjects when user is set', async () => {
		await getSubjects({} as User)

		expect(allSubjectsSpy).toHaveBeenCalled()
		expect(allSubjectsPublicSpy).not.toHaveBeenCalled()
	})
})
