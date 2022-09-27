import {DatabaseError, PoolClient, QueryResult} from 'pg'
import pool from './poolService'
import HttpErrorBadRequest from '../../errors/HttpErrorBadRequest'

import * as thisModule from './databaseService'

export type ReturnType<T> = Promise<QueryResult<T>>

export async function begin(): Promise<PoolClient> {
	const client = await pool.connect()
	await client.query('BEGIN')

	return client
}

export async function commit(client: PoolClient): Promise<void> {
	await client.query('COMMIT')
	client.release()
}

export async function rollback(client: PoolClient): Promise<void> {
	await client.query('ROLLBACK')
	client.release()
}

export async function query<T>(query: string, params?: (string|number|boolean|number[]|string[]|boolean[])[], client?: PoolClient): ReturnType<T> {
	const clientNotExist = !client
	if(clientNotExist) client = await thisModule.begin()

	try {
		if (params) params = params.map(param => {
			if (typeof param === 'string' && param === '') return null

			return param
		})

		const res = await client.query(query, params)

		if (clientNotExist) await thisModule.commit(client)

		return res
	} catch (e) {
		if (clientNotExist) await thisModule.rollback(client)

		if ((e as DatabaseError).message.includes('violates not-null constraint')) {
			throw new HttpErrorBadRequest(`${(e as DatabaseError).column.toUpperCase()}_IS_REQUIRED`, e)
		} else if ((e as DatabaseError).message.includes('duplicate key value violates unique constraint')) {
			const field = (e as DatabaseError).detail.match(/Key \((.*?)\)/)
			throw new HttpErrorBadRequest(`${field[1].toUpperCase()}_ALREADY_EXISTS`, e)
		}

		throw e
	}

}
