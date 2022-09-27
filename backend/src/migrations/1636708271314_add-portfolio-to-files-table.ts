/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addColumn('files', {
		portfolio_order: {
			type: 'integer',
			notNull: true
		},
		portfolio_id: {
			references: '"portfolios"',
			type: 'integer',
			notNull: true,
			onDelete: 'CASCADE'
		},
	})

	pgm.addConstraint('files', 'portfolio_unique_order', {
		unique: ['portfolio_id', 'portfolio_order'],
	})
	pgm.addIndex('files', 'portfolio_id')
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('files', 'portfolio_unique_order')
	pgm.dropColumns('files', ['portfolio_order', 'portfolio_id'])
}
