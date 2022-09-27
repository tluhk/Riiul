import worksDatabaseService from '../../src/database/services/worksDatabaseService'
import {DateTime} from 'luxon'
import filesDatabaseService from '../../src/database/services/filesDatabaseService'
import File from '../../src/types/File'
import User from '../../src/types/User'
import {findWork, getWorks} from '../../src/services/worksService'
import tagDatabaseService from '../../src/database/services/tagDatabaseService'
import authorDatabaseService from '../../src/database/services/authorDatabaseService'
import faker from 'faker'
import WorkExternalLink from '../../src/types/WorkExternalLink'
import WORK_EXTERNAL_LINK from '../../src/enums/WORK_EXTERNAL_LINK'
import workExternalLinksDatabaseService from '../../src/database/services/workExternalLinksDatabaseService'
import Work from "../../src/types/Work";

const MOCK_WORKS = [
	{
		id: 1,
		subjectId: 1,
		title: 'work-1',
		description: faker.random.words(10),
		tags: faker.random.words(10).split(' '),
		authors: faker.random.words(10).split(' '),
		priority: faker.datatype.boolean(),
		active: true,
		createdAt: DateTime.now(),
		updatedAt: DateTime.now(),
		graduationYear: faker.date.past().getFullYear(),
	},
	{
		id: 2,
		subjectId: 2,
		title: 'work-2',
		description: faker.random.words(10),
		tags: faker.random.words(10).split(' '),
		authors: faker.random.words(10).split(' '),
		priority: faker.datatype.boolean(),
		active: true,
		createdAt: DateTime.now(),
		updatedAt: DateTime.now(),
		graduationYear: faker.date.past().getFullYear(),
	},
	{
		id: 3,
		subjectId: 1,
		title: 'work-3',
		description: faker.random.words(10),
		tags: faker.random.words(10).split(' '),
		authors: faker.random.words(10).split(' '),
		priority: faker.datatype.boolean(),
		active: false,
		createdAt: DateTime.now(),
		updatedAt: DateTime.now(),
		graduationYear: faker.date.past().getFullYear(),
	}
] as Work[]

const MOCK_WORK = {
	id: 1,
	subjectId: 1,
	title: 'work-1',
	description: 'Lorem Ipsum',
	priority: false,
	active: true,
	createdAt: DateTime.now(),
	updatedAt: DateTime.now(),
	graduationYear: 2021,
} as Work

const MOCK_FILES = [
	{
		id: 3,
		workId: 1,
		type: 'IMG',
		extension: 'jpg',
		name: 'test-image-1'
	},
	{
		id: 4,
		workId: 1,
		type: 'PDF',
		extension: 'pdf',
		name: 'test-pdf-1'
	},
	{
		id: 5,
		workId: 2,
		type: 'IMG',
		extension: 'jpg',
		name: 'test-image-2'
	},
	{
		id: 6,
		workId: 3,
		type: 'IMG',
		extension: 'jpg',
		name: 'test-image-3'
	}
] as unknown as File[]

const MOCK_EXTERNAL_LINKS = [
	{
		title: faker.random.word(),
		type: WORK_EXTERNAL_LINK.EXTERNAL,
		link: faker.internet.url()
	},
	{
		title: faker.random.word(),
		type: WORK_EXTERNAL_LINK.YOUTUBE,
		link: faker.internet.url()
	}
] as WorkExternalLink[]

describe('findwork', () => {
	let findWorksSpy: jest.SpyInstance
	let findWorksPublicSpy: jest.SpyInstance
	let findFilesWithWorksIdSpy: jest.SpyInstance
	let findTagsWithWorksIdSpy: jest.SpyInstance
	let findAuthorsWithWorksIdSpy: jest.SpyInstance
	let findExternalLinksWithWorksIdSpy: jest.SpyInstance

	beforeEach(async () => {
		findWorksSpy = jest.spyOn(worksDatabaseService, 'findWorkWithTitle')
			.mockReturnValue(Promise.resolve(MOCK_WORK))
		findWorksPublicSpy = jest.spyOn(worksDatabaseService, 'findWorkPublicWithTitle')
			.mockReturnValue(Promise.resolve(MOCK_WORK))
		findFilesWithWorksIdSpy = jest.spyOn(filesDatabaseService, 'findWithWorksId')
			.mockReturnValue(Promise.resolve(MOCK_FILES))
		findTagsWithWorksIdSpy = jest.spyOn(tagDatabaseService, 'findWithWorkId')
			.mockReturnValue(Promise.resolve([{ id: 1, name: 'test-tag-1' }, { id: 1, name: 'test-tag-1' }]))
		findAuthorsWithWorksIdSpy = jest.spyOn(authorDatabaseService, 'findWithWorkId')
			.mockReturnValue(Promise.resolve([{ id: 1, name: 'test-author-1' }, { id: 1, name: 'test-author-1' }]))
		findExternalLinksWithWorksIdSpy = jest.spyOn(workExternalLinksDatabaseService, 'findWithWorkId')
			.mockReturnValue(Promise.resolve(MOCK_EXTERNAL_LINKS))
	})

	it('should call findWorkWithTitle when user is present', async () => {
		const res = await findWork('work-1', { id: 1 } as User)

		expect(findWorksSpy).toHaveBeenNthCalledWith(1, 'work-1')
		expect(findWorksPublicSpy).not.toHaveBeenCalled()

		expect(findFilesWithWorksIdSpy).toHaveBeenNthCalledWith(1, [1])
		expect(findTagsWithWorksIdSpy).toHaveBeenNthCalledWith(1, 1)
		expect(findAuthorsWithWorksIdSpy).toHaveBeenNthCalledWith(1, 1)
		expect(findExternalLinksWithWorksIdSpy).toHaveBeenNthCalledWith(1, 1)

		expect(res).toEqual({
			id: 1,
			subjectId: 1,
			title: 'work-1',
			description: 'Lorem Ipsum',
			priority: false,
			active: true,
			tags: ['test-tag-1', 'test-tag-1'],
			authors: ['test-author-1', 'test-author-1'],
			images: [{ id:3, name: 'test-image-1.jpg' }, { id: 5, name: 'test-image-2.jpg' }, { id: 6, name: 'test-image-3.jpg' }],
			files: [{ id:4, name: 'test-pdf-1.pdf' }],
			externalLinks: MOCK_EXTERNAL_LINKS,
			graduationYear: 2021,
		})
	})

	it('should call findWorkPublicWithTitle when user is not present', async () => {
		const res = await findWork('work-1')

		expect(findWorksSpy).not.toHaveBeenCalled()
		expect(findWorksPublicSpy).toHaveBeenNthCalledWith(1, 'work-1')

		expect(findFilesWithWorksIdSpy).toHaveBeenNthCalledWith(1, [1])
		expect(findTagsWithWorksIdSpy).toHaveBeenNthCalledWith(1, 1)
		expect(findAuthorsWithWorksIdSpy).toHaveBeenNthCalledWith(1, 1)
		expect(findExternalLinksWithWorksIdSpy).toHaveBeenNthCalledWith(1, 1)

		expect(res).toEqual({
			id: 1,
			subjectId: 1,
			title: 'work-1',
			description: 'Lorem Ipsum',
			priority: false,
			tags: ['test-tag-1', 'test-tag-1'],
			authors: ['test-author-1', 'test-author-1'],
			images: [{ id:3, name: 'test-image-1.jpg' }, { id: 5, name: 'test-image-2.jpg' }, { id: 6, name: 'test-image-3.jpg' }],
			files: [{ id:4, name: 'test-pdf-1.pdf' }],
			externalLinks: MOCK_EXTERNAL_LINKS,
			graduationYear: 2021,
		})

	})
})

describe('getWorks', () => {
	let allWorksSpy: jest.SpyInstance
	let allWorksPublicSpy: jest.SpyInstance

	beforeEach(async () => {
		allWorksSpy = jest.spyOn(worksDatabaseService, 'allWorks')
			.mockReturnValue(Promise.resolve(MOCK_WORKS))
		allWorksPublicSpy = jest.spyOn(worksDatabaseService, 'allWorksPublic')
			.mockReturnValue(Promise.resolve(MOCK_WORKS.filter(work => work.active)))
		jest.spyOn(filesDatabaseService, 'findWithWorksId')
			.mockReturnValue(Promise.resolve(MOCK_FILES))

	})

	it('should call allWorks when user is present', async () => {
		const res = await getWorks({ name: 'user name'} as User)

		expect(allWorksSpy).toHaveBeenCalledTimes(1)
		expect(allWorksPublicSpy).not.toHaveBeenCalled()

		expect(res).toEqual([
			{
				id: 1,
				title: 'work-1',
				subjectId: 1,
				image: 'test-image-1.jpg',
				active: true
			},
			{
				id: 2,
				title: 'work-2',
				subjectId: 2,
				image: 'test-image-2.jpg',
				active: true
			},
			{
				id: 3,
				title: 'work-3',
				subjectId: 1,
				image: 'test-image-3.jpg',
				active: false
			}
		])
	})

	it('should call allPublicWorks when user is not present', async () => {
		const res = await getWorks(undefined)

		expect(allWorksPublicSpy).toHaveBeenCalledTimes(1)
		expect(allWorksSpy).not.toHaveBeenCalled()

		expect(res).toEqual([
			{
				id: 1,
				title: 'work-1',
				subjectId: 1,
				image: 'test-image-1.jpg'
			},
			{
				id: 2,
				title: 'work-2',
				subjectId: 2,
				image: 'test-image-2.jpg'
			}
		])
	})

	it('should correctly compile the query params', async () => {
		const query = {
			q: 'test',
			tags: 'tag1,tag2',
			authors: 'author1,author2',
			subjects: 'subject',
			active: 'true'
		}

		await getWorks(undefined, query)
		expect(allWorksPublicSpy).toHaveBeenNthCalledWith(1, {
			q: 'test',
			tags: ['tag1', 'tag2'],
			authors: ['author1', 'author2'],
			subjects: ['subject'],
			active: true
		}, undefined )
	})
})
