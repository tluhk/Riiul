import {configDev} from './config.dev'
import {configTest} from './config.test'
import {configProd} from './config.prod'

export interface ConfigProps {
	API_URL: string;
}

class Config {
	private static _config: ConfigProps

	static loadData() {
		if (process.env.NODE_ENV === 'test') {
			this._config = configTest
		} else if (process.env.NODE_ENV === 'production') {
			this._config = configProd
		} else if (process.env.NODE_ENV === 'development') {
			this._config = configDev
		}

	}

	get(key: keyof ConfigProps) {
		return this._config[key]
	}
}
