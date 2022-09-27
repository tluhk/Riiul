/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.renameTable('portfolios', 'works')

	pgm.renameColumn('files', 'portfolio_id', 'work_id')
	pgm.renameColumn('files', 'portfolio_order', 'work_order')

	pgm.renameTable('tags_in_portfolio', 'tags_in_work')
	pgm.renameColumn('tags_in_work', 'portfolio_id', 'work_id')
	pgm.renameConstraint('tags_in_work', 'tags_in_portfolio_uniq_portfolio_id_tag_id', 'tags_in_work_uniq_work_id_tag_id')

	pgm.renameTable('authors_in_portfolio', 'authors_in_work')
	pgm.renameColumn('authors_in_work', 'portfolio_id', 'work_id')
	pgm.renameConstraint('authors_in_work', 'authors_in_portfolio_uniq_portfolio_id_author_id', 'authors_in_work_uniq_work_id_author_id')

	pgm.renameTable('portfolio_external_links', 'work_external_links')
	pgm.renameColumn('work_external_links', 'portfolio_id', 'work_id')
	pgm.renameConstraint('work_external_links', 'portfolio_external_links_uniq_portfolio_id_type', 'work_external_links_uniq_work_id_type')

}

export async function down(): Promise<void> {
	throw new Error('Unable to roll back this migration')
}
