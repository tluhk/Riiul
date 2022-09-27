import {del, get, post, put} from '../common/request'
import Work from './models/Work'
import {WorkResponse} from './types/WorkResponse'
import {WorkUpdateForm} from './types/WorkUpdateForm'
import {workQueryPropsToString} from './helpers/workQueryPropsToString'
import {WorkNewForm} from './types/WorkNewForm'
import WorkShortResponse from './types/WorkShortResponse'
import WorkShort from './models/WorkShort'
import {WorkQueryProps} from './types/WorkQueryProps'

async function find(name: string, auth = false): Promise<Work> {
	const { body } = await get<WorkResponse>(`/works/${name}`, auth)

	return Work.fromWorkResponse(body)
}

async function getAll(query?: WorkQueryProps, auth = false): Promise<WorkShort[]> {
	const queryString = query ? workQueryPropsToString(query) : ''

	const { body } = await get<WorkShortResponse[]>(`/works?${queryString}`, auth)

	return body.map(WorkShort.fromWorkResponse)
}

async function add(work: WorkNewForm): Promise<void> {
	await post('/works', work)
}

async function remove(id: number): Promise<void> {
	del<undefined>(`/works/${id}`, true)
}

async function update(id: number, work: WorkUpdateForm): Promise<void> {
	await put<undefined>(`/works/${id}`, work, true)
}

export default {
	find,
	getAll,
	add,
	remove,
	update
}
