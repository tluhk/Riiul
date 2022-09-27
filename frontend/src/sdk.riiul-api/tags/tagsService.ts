import { get } from '../common/request'

async function getAll(auth = false): Promise<string[]> {
	return get<string[]>('/tags', auth)
		.then(res => res.body)
		.catch(() => [])
}

export default {
	getAll
}
