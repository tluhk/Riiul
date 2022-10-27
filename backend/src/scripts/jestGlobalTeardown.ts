import {query} from "../database/shared"

async function jestGlobalTeardown(): Promise<void> {
	await query(`drop schema public CASCADE;`)
	await query(`create schema public;`)
}

export default jestGlobalTeardown
