import generateWorkConditionQuery from './generateWorkConditionQuery'

describe('generateConditionQuery', () => {
	it('should generate a query with the query', () => {
		const { condition, data } = generateWorkConditionQuery({ q: 'TEST_NAME'})

		expect(condition).toBe('(title LIKE $1 OR description LIKE $1)')
		expect(data).toEqual([ '%TEST_NAME%' ])
	})

	it('should generate a query with the active condition', () => {
		const { condition, data } = generateWorkConditionQuery({ active: true })

		expect(condition).toBe('(works.active = $1 AND subjects.active = $1)')
		expect(data).toEqual([ true ])
	})

	it('should generate a query with the not active condition', () => {
		const { condition, data } = generateWorkConditionQuery({ active: false })

		expect(condition).toBe('(works.active = $1 OR subjects.active = $1)')
		expect(data).toEqual([ false ])
	})

	describe.each`
	dataInput				| expectedCondition
	${[]}					| ${undefined}
	${[ 'TEST' ]}			| ${'$1'}
	${[ 'TEST', 'TEST_2' ]}	| ${'$1, $2'}
	`('data', ({ dataInput, expectedCondition}) => {
		it('should generate a query with the works condition', () => {
			const { condition, data } = generateWorkConditionQuery({ subjects: dataInput })

			expect(condition).toBe(expectedCondition ? `subjects.name IN (${expectedCondition})` : '')
			expect(data).toEqual(dataInput)
		})

		it('should generate a query with the authors condition', () => {
			const { condition, data } = generateWorkConditionQuery({ authors: dataInput })

			expect(condition).toBe(expectedCondition ? `authors.name IN (${expectedCondition})` : '')
			expect(data).toEqual(dataInput)
		})

		it('should generate a query with the tags condition', () => {
			const { condition, data } = generateWorkConditionQuery({ tags: dataInput })

			expect(condition).toBe(expectedCondition ? `tags.name IN (${expectedCondition})` : '')
			expect(data).toEqual(dataInput)
		})
	})
})
