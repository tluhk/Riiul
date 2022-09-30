import React, {createContext, useEffect} from 'react'
import {Config, ConfigKeys} from '../utils/config'
import {API} from '../utils/sdk/makeRequest'

export type ConfigContextProps = {
	get(key: ConfigKeys): string
}

export const ConfigContext = createContext<ConfigContextProps>({
	get: () => {
		throw new Error('Not been initialized')
	}
})

export const ConfigProvider = React.memo<{children: React.ReactNode}>(props => {
	useEffect(() => {
		Config.init()

		API.defaults.baseURL = Config.get(ConfigKeys.API_URL)
	}, [])

	const value = {
		get: Config.get
	}

	return <ConfigContext.Provider value={value}>
		{props.children}
		</ConfigContext.Provider>
})

