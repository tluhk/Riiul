/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('portfolios', {
		id: 'id',
		subject_id: { type: 'integer', notNull: true },
		title: { type: 'text', notNull: true, unique: true },
		description: { type: 'text', notNull: true },
		tags: { type: 'text' },
		authors: { type: 'text' },
		priority: { type: 'boolean', notNull: true },
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

	pgm.createIndex('portfolios', ['subject_id', 'active'])
	pgm.createIndex('portfolios', ['title', 'description', 'tags', 'authors'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('portfolios')
}
