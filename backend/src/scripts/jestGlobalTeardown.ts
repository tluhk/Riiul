import {query} from "../database/shared";

async function jestGlobalTeardown(): Promise<void> {
	await query(`drop schema public;`)
	await query(`create schema public;`)
}

export default jestGlobalTeardown
