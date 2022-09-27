import {get as getRequest} from '../common/request'
import WorkShort from '../works/models/WorkShort'
import WorkShortResponse from '../works/types/WorkShortResponse'

async function get(): Promise<Record<number, WorkShort[]>> {
	const { body } = await getRequest<Record<number, WorkShortResponse[]>>('/homepage')

	const keys = Object.keys(body)

	const res: Record<number, WorkShort[]> = {}

	for (const key of keys) {
		res[parseInt(key)] = body[parseInt(key)].map(WorkShort.fromWorkResponse)
	}

	return res
}

export default {
	get
}
