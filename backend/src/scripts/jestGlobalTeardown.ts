import usersDatabaseService from '../database/services/usersDatabaseService'
import pool from '../database/services/poolService'

async function jestGlobalTeardown(): Promise<void> {
	await usersDatabaseService.deleteUser(1)

	await pool.end()
}

export default jestGlobalTeardown
