import {DateTime} from 'luxon'
import fileMapper from '../../../src/database/mappers/fileMapper'

describe('fileMapper', () => {
	it('should return user', () => {
		const user = {
			id: 1,
			name: '12345678-document',
			extension: '.pdf',
			original_name: 'document',
			work_order: 1,
			work_id: 2,
			type: 'PDF',
			created_at: new Date('2021-10-10T00:00:00.000'),
			updated_at: new Date('2021-10-27T00:00:00.000')
		}
		const result = {
			id: 1,
			name: '12345678-document',
			extension: '.pdf',
			originalName: 'document',
			workOrder: 1,
			workId: 2,
			type: 'PDF',
			createdAt: DateTime.fromObject({ year: 2021, month: 10, day: 10}),
			updatedAt: DateTime.fromObject({ year: 2021, month: 10, day: 27})
		}
		expect(fileMapper(user)).toEqual(result)
	})

	it('should return null when input is undefined', () => {
		expect(fileMapper(undefined)).toBeNull()
	})

	it('should return null when input is null', () => {
		expect(fileMapper(null)).toBeNull()
	})
})
