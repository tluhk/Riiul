import React, {useMemo, useState} from 'react'
import TagsContext from './TagsContext'
import useLogin from '../../service.admin/login/useLogin'
import useAsyncEffect from '../helpers/useAsyncEffect'
import tagsService from '../../sdk.riiul-api/tags/tagsService'

const TagsProvider = React.memo(props => {
	const {isAuthenticated} = useLogin()
	const [tags, setTags] = useState<string[] | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useAsyncEffect(async () => {
		setIsLoading(true)

		setTags(await tagsService.getAll(isAuthenticated))

		setIsLoading(false)
	}, [isAuthenticated])

	const memorizedValue = useMemo(() => ({
		tags,
		isLoading
	}), [tags, isLoading])

	return (
		<TagsContext.Provider value={memorizedValue}>
			{props.children}
		</TagsContext.Provider>
	)
})

export default TagsProvider
