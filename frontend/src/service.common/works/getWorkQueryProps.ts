import {WorkQueryProps} from '../../sdk.riiul-api/works/types/WorkQueryProps'

export function getWorkQueryProps(): WorkQueryProps {
	const search = new URLSearchParams(window.location.search)

	const response: WorkQueryProps = {
		q: search.get('q') || undefined,
	}

	const authors = search.get('authors')
	const tags = search.get('tags')
	const subjects = search.get('subjects')

	if (authors && authors.replaceAll(',', '')) response.authors = authors.split(',')
	if (tags && tags.replaceAll(',', '')) response.tags = tags.split(',')
	if (subjects && subjects.replaceAll(',', '')) response.subjects = subjects.split(',')

	return response
}
