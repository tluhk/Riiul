/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('files', {
		id: 'id',
		name: { type: 'text', notNull: true, unique: true },
		extension: { type: 'varchar(6)', notNull: true },
		original_name: { type: 'varchar(128)', notNull: true },
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

	pgm.createIndex('files', ['extension', 'name'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('files')
}
