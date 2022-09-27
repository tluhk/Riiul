import {query} from './databaseService'
import WorkDatabaseType from '../types/WorkDatabaseType'
import workMapper from '../mappers/workMapper'
import Work from '../../types/Work'
import WorkPostBody from '../../types/WorkPostBody'
import WorkUpdateBody from '../../types/WorkUpdateBody'
import HttpErrorNotFound from '../../errors/HttpErrorNotFound'
import {PoolClient} from 'pg'
import HttpErrorBadRequest from '../../errors/HttpErrorBadRequest'
import WorkQueryType from '../types/WorkQueryType'
import generateConditionQuery from '../util/generateWorkConditionQuery'

const UPDATABLE_FIELDS = [
	'subjectId',
	'title',
	'description',
	'priority',
	'active',
	'graduationYear',
	'isVideoPreviewImage'
]

async function findWorkWithTitle(title: string, client?: PoolClient): Promise<Work> {
	const res = await query<WorkDatabaseType>('SELECT * FROM works WHERE LOWER(title) = LOWER($1)', [title], client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('WORK_NOT_FOUND')

	return workMapper(res.rows[0])
}

async function findWorkPublicWithTitle(title: string, client?: PoolClient): Promise<Work> {

	const res = await query<WorkDatabaseType>(
		'SELECT *, works.id as id FROM works ' +
		'LEFT JOIN subjects ON subjects.id = works.subject_id ' +
		'WHERE LOWER(works.title) = LOWER($1) ' +
		'AND works.active = $2 ' +
		'AND subjects.active = $2', [title, true], client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('WORK_NOT_FOUND')

	return workMapper(res.rows[0])
}

async function allWorks(params?: WorkQueryType, client?: PoolClient): Promise<Work[]> {
	const {condition, data} = generateConditionQuery(params)

	const res = await query<WorkDatabaseType>(
		`SELECT res.* FROM (
    			SELECT DISTINCT ON (works.id) works.* FROM works
					LEFT JOIN authors_in_work AS aiw ON aiw.work_id = works.id
                    LEFT JOIN authors ON authors.id = aiw.author_id
                    LEFT JOIN tags_in_work AS tiw ON tiw.work_id = works.id
                    LEFT JOIN tags ON tags.id = tiw.tag_id
					JOIN subjects on subjects.id = works.subject_id
					${condition ? 'WHERE ' + condition : ''}
    				order by works.id desc
    			) as res ORDER BY res.priority desc`,
		data,
		client
	)

	return res.rows.map(workMapper)
}

async function allWorksPublic(params?: WorkQueryType, client?: PoolClient): Promise<Work[]> {
	params = {
		...params,
		active: true
	}

	return await allWorks(params, client)
}

async function deleteWork(id: number, client?: PoolClient): Promise<void> {
	const res = await query('DELETE FROM works WHERE id = $1', [id], client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('WORK_NOT_FOUND')
}

async function saveWork(work: WorkPostBody, client: PoolClient): Promise<Work> {
	const data = [
		work.subjectId,
		work.title,
		work.description,
		work.priority,
		work.active,
		work.graduationYear,
		work.isVideoPreviewImage
	]
	const res = await query<WorkDatabaseType>('INSERT INTO works' +
		'(subject_id, title, description, priority, active, graduation_year, is_video_preview_image)' +
		'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', data, client)

	return workMapper(res.rows[0])
}

async function updateWork(id: number, work: WorkUpdateBody, client: PoolClient): Promise<Work> {
	const values: (boolean|string|number)[] = [id, new Date().toISOString()]
	const fields = []

	for (const [key, value] of Object.entries(work)) {
		if (!UPDATABLE_FIELDS.includes(key)) continue

		values.push(value as boolean|string|number)
		fields.push(`${key.replace(/([A-Z])/g, '_$1').trim()} = $${values.length}`)
	}

	if (fields.length === 0) throw new HttpErrorBadRequest('NO_FIELDS_TO_UPDATE')

	const res = await query<WorkDatabaseType>(`UPDATE works SET ${fields.join(', ')}, updated_at = $2 WHERE id = $1 RETURNING *`, values, client)
	if (res.rowCount === 0) throw new HttpErrorNotFound('WORK_NOT_FOUND')

	return workMapper(res.rows[0])
}

export default {
	allWorks,
	allWorksPublic,
	findWorkWithTitle,
	findWorkPublicWithTitle,
	deleteWork,
	saveWork,
	updateWork
}
