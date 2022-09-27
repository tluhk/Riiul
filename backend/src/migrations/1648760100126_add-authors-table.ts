import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.dropColumn('portfolios', 'authors')

	pgm.createTable('authors', {
		id: 'id',
		name: { type: 'VARCHAR(16)', notNull: true, unique: true },
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

	pgm.createTable('authors_in_portfolio', {
		id: 'id',
		portfolio_id: {
			type: 'integer',
			notNull: true,
			references: 'portfolios',
			onDelete: 'CASCADE'
		},
		author_id: {
			type: 'integer',
			notNull: true,
			references: 'authors',
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
			unique: ['portfolio_id', 'author_id']
		}
	})
}

export async function down(): Promise<void> {
	throw new Error('Unable to rollback this migration')
}
