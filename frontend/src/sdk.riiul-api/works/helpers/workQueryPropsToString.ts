import {WorkQueryProps} from '../types/WorkQueryProps'

export function workQueryPropsToString(params: WorkQueryProps): string {
	const query = []

	if (params.q) query.push(`q=${params.q}`)
	if (params.subjects && params.subjects.length > 0) query.push(`subjects=${params.subjects.join(',')}`)
	if (params.authors && params.authors.length > 0) query.push(`authors=${params.authors.join(',')}`)
	if (params.tags && params.tags.length > 0) query.push(`tags=${params.tags.join(',')}`)

	return query.join('&')
}
