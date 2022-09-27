/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addColumn('files', {
		type: {
			type: 'varchar(3)',
			default: 'IMG',
			notNull: true
		},
	})
	pgm.dropConstraint('files', 'portfolio_unique_order')

	pgm.addConstraint('files', 'portfolio_unique_order', {
		unique: ['portfolio_id', 'portfolio_order', 'type'],
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('files', 'portfolio_unique_order')
}
