import {Config} from './config'
import {configProd} from './config.prod'
import {configDev} from './config.dev'
import { ConfigKeys } from './ConfigKeys'

describe('config', () => {
	const OLD_ENV = process.env

	function setNodeEnv(env?: string) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		process.env.NODE_ENV = env
	}

	beforeEach(() => {
		jest.resetModules()
		process.env = { ...OLD_ENV }
	})

	afterEach(() => {
		process.env = OLD_ENV
	})

	test('production environment should use correct config', () => {
		setNodeEnv('production')
		Config.init()

		expect(Config.get(ConfigKeys.API_URL)).toBe(configProd[ConfigKeys.API_URL])
	})

	test('when no env, should default to development config', () => {
		setNodeEnv(undefined)
		Config.init()

		expect(Config.get(ConfigKeys.API_URL)).toBe(configDev[ConfigKeys.API_URL])
	})
})
