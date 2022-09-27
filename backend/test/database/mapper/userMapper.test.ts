import userMapper from '../../../src/database/mappers/userMapper'
import {DateTime} from 'luxon'

describe('userMapper', () => {
	it('should return user', () => {
		const user = {
			id: 1,
			name: 'name',
			email: 'test.user@email.com',
			password: 'Password1',
			created_at: new Date('2021-10-10T00:00:00.000'),
			updated_at: new Date('2021-10-27T00:00:00.000')
		}
		const result = {
			id: 1,
			name: 'name',
			email: 'test.user@email.com',
			password: 'Password1',
			createdAt: DateTime.fromObject({ year: 2021, month: 10, day: 10}),
			updatedAt: DateTime.fromObject({ year: 2021, month: 10, day: 27})
		}
		expect(userMapper(user)).toEqual(result)
	})

	it('should return null when input is undefined', () => {
		expect(userMapper(undefined)).toBeNull()
	})

	it('should return null when input is null', () => {
		expect(userMapper(null)).toBeNull()
	})
})
