/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('subjects', {
		id: 'id',
		name: { type: 'text', notNull: true, unique: true },
		active: { type: 'boolean', notNull: true },
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

	pgm.addConstraint('portfolios', 'subjects_portfolios_id_fkey', {
		foreignKeys: [
			{
				columns: 'subject_id',
				references: 'portfolios'
			}
		]
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('portfolios', 'subjects_portfolios_id_fkey')
	pgm.dropTable('subjects')
}
