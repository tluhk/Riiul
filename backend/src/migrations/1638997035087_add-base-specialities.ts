/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.sql('INSERT INTO public.subjects(name, active) VALUES' +
		'(\'Käsitöö tehnoloogiad ja disain\', true),' +
		'(\'Rakendusinformaatika\', true),' +
		'(\'Liiklusohutus\', true),' +
		'(\'Tervisejuht\', true);', )
}

export async function down(): Promise<void> {
	throw new Error('Unable to roll back this migration')
}
