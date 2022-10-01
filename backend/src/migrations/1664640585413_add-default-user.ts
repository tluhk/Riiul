/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'
import {addUser} from '../services/usersService'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(): Promise<void> {
	await addUser({
		name: 'Default user',
		email: 'default-user@tlu.com',
		password: 'root',
	})
}

export async function down(): Promise<void> {
	throw new Error('Unable to roll back this migration')
}
