import File from '../types/File'
import filesDatabaseService from '../database/services/filesDatabaseService'
import fs from 'fs'
import path from 'path'
import {DateTime} from 'luxon'
import HttpErrorNotFound from '../errors/HttpErrorNotFound'
import {PoolClient} from 'pg'
import {rollback} from '../database/services/databaseService'

const dir = path.join(__dirname, '/../../files/')

export async function getFile(name: string): Promise<Buffer> {
	const filePath = path.join(dir, name)
	if (!fs.existsSync(filePath)) throw new HttpErrorNotFound('FILE_NOT_FOUND')

	return fs.readFileSync(filePath)
}

export async function updateFileOrder(id: number, order: number, client: PoolClient): Promise<File> {
	return await filesDatabaseService.updateFile(id, order, client)
}

export async function saveFile(filename: string, data: string, work: { id: number, order: number }, client: PoolClient): Promise<File> {
	const originalName = filename.split('.')[0]
	const extension = filename.split('.').pop()
	const type = extension === 'pdf' ? 'PDF' : 'IMG'

	const file = {
		name: `${DateTime.now().toMillis()}-${originalName}`,
		originalName,
		extension,
		workOrder: work.order,
		workId: work.id,
		type,
	}

	try {
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

		fs.writeFileSync(path.join(dir, `${file.name}.${file.extension}`), data, 'base64')
	} catch (err) {
		await rollback(client)
		throw err
	}

	return await filesDatabaseService.save(file, client)
}

export async function deleteFile(id: number, client: PoolClient): Promise<void> {
	await filesDatabaseService.deleteFile(id, client)
}
