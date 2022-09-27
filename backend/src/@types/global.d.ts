export { }

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test'
			PORT?: string
			JWT_TOKEN: string
			SALT_ROUNDS: string
			ROLLBAR_TOKEN: string
		}
	}
}
