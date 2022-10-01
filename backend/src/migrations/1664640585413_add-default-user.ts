/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'
import bcrypt from 'bcrypt'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	const PASSWORD = 'root'
	const EMAIL = 'default.user@tlu.ee'
	const NAME = 'default user'
	const HASH_PASSWORD = await bcrypt.hash(PASSWORD, parseInt(process.env.SALT_ROUNDS))

	pgm.sql(`INSERT INTO public.users(name, email, password) VALUES ('${NAME}', '${EMAIL}', '${HASH_PASSWORD}')`)
}

export async function down(): Promise<void> {
	throw new Error('Unable to roll back this migration')
}
