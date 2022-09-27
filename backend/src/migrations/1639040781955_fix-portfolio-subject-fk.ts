/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('portfolios', 'subjects_portfolios_id_fkey')
	pgm.addConstraint('portfolios', 'subjects_portfolios_id_fkey', {
		foreignKeys: [
			{
				columns: 'subject_id',
				references: 'subjects'
			}
		]
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('portfolios', 'subjects_portfolios_id_fkey')
}
