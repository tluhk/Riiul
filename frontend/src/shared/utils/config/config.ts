import {configDev} from './config.dev'
import {configProd} from './config.prod'
import {ConfigKeys} from './ConfigKeys'

export class Config {
	private static _config: Record<ConfigKeys, string>

	static init(): void {
		Config._config = configDev

		if (process.env.NODE_ENV === 'production') Config._config = configProd
	}

	static get(key: ConfigKeys): string {
		if (!this._config) throw new Error('Config has not been initialized')

		return Config._config[key]
	}
}
