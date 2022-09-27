/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('users', {
		id: 'id',
		name: { type: 'varchar(64)', notNull: true },
		email: { type: 'varchar(128)', notNull: true },
		password: { type: 'text', notNull: true },
		updated_at: {
			default: pgm.func('current_timestamp'),
			type: 'timestamp',
			notNull: true
		},
		created_at: {
			default: pgm.func('current_timestamp'),
			type: 'timestamp',
			notNull: true
		}
	})

	pgm.createIndex('users', ['email', 'password'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('users')
	pgm.dropIndex('users', ['email', 'password'])
}
