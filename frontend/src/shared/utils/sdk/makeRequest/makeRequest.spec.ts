// TODO: Update jest to at least 27.5.1
export {}

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    request: jest.fn().mockImplementation(() => ({ data: { }}))
  }))
}))
/*
describe('makeRequest', () => {
  it('should send axios request', async() => {
    const config = {
      params: {
        id: 12
      },
      query: {
        page: 1,
        per_page: 10
      },
      body: {
        test: 'test-value'
      }
    }

    await makeRequest('POST', 'http://localhost:8080/api/v1/users/{id}', config)

    expect(API.request).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/users/12',
      params: {
        page: 1,
        per_page: 10
      },
      data: {
        test: 'test-value'
      }
    })
  })
})
*/
