import {mount} from 'enzyme'
import {ConfigProvider} from './ConfigProvider'
import {Config, ConfigKeys} from '../utils/config'
import {API} from '../utils/sdk/makeRequest'

async function renderComponent() {
	const component = await mount(
		<ConfigProvider><h1 id="title">Title</h1></ConfigProvider>
	)
	component.update()

	return component
}

describe('<ConfigProvider>', () => {
	test('config provider should render chilren', async () => {
		const wrapper = await renderComponent()

		expect(wrapper.find('#title').length).toBe(1)
	})

	test('should initialize config', async () => {
		await renderComponent()

		const result = expect(() => Config.get(ConfigKeys.API_URL))
		result.not.toThrow()
		result.not.toBeNull()
	})

	test('should set API baseUrl config', async () => {
		await renderComponent()

		expect(API.defaults.baseURL).not.toBeNull()
	})
})
