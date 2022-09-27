export { }

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test'
			REACT_APP_API_URL: string
		}
	}
}
