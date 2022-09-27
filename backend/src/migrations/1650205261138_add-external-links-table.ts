/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.dropColumn('portfolios', 'video_link')

	pgm.createTable('portfolio_external_links', {
		id: 'id',
		title: { type: 'varchar(16)', notNull: true },
		link: { type: 'text', notNull: true },
		type: { type: 'varchar(8)', notNull: true },
		portfolio_id: {
			type: 'integer',
			notNull: true,
			references: 'portfolios',
			onDelete: 'CASCADE'
		},
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
	},
	{
		constraints: {
			unique: ['portfolio_id', 'type']
		}
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.addColumns('portfolios', {
		video_link: { type: 'text' }
	})

	pgm.dropTable('portfolio_external_links')
}
