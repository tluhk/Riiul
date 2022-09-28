import {configDev} from './config.dev'
import {configProd} from './config.prod'

export interface ConfigProps {
	API_URL: string;
}

class Config {
	private static _config: ConfigProps

	static loadData() {
		if (process.env.NODE_ENV === 'production') {
			this._config = configProd
		} else if (process.env.NODE_ENV === 'development') {
			this._config = configDev
		}

	}

	static get(key: keyof ConfigProps) {
		return Config._config[key]
	}
}
