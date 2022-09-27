/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addColumns('portfolios', {
		graduation_year: { type: 'smallint' },
		video_link: { type: 'text' }
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropColumns('portfolios', ['graduation_year', 'video_link'])
}
