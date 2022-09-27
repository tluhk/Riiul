import { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createConstraint('users', 'users_email_unique', {
		unique: 'email'
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropConstraint('users', 'users_email_unique')
}
