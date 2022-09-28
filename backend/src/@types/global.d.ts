export { }

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PO: 'development' | 'production' | 'test'
			PORT?: string
			JWT_TOKEN: string
			SALT_ROUNDS: string
			ROLLBAR_TOKEN: string
		}
	}
}
