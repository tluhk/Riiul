import { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addColumn('works', {
		is_video_preview_image: {
			type: 'boolean',
			default: false,
		}
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropColumn('works', 'is_video_preview_image')
}
