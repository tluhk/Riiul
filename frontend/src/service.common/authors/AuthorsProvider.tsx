import React, {useMemo, useState} from 'react'
import AuthorsContext from './AuthorsContext'
import useLogin from '../../service.admin/login/useLogin'
import useAsyncEffect from '../helpers/useAsyncEffect'
import authorService from '../../sdk.riiul-api/authors/authorService'

const AuthorsProvider = React.memo(props => {
	const {isAuthenticated} = useLogin()

	const [authors, setAuthors] = useState<string[] | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useAsyncEffect(async () => {
		setIsLoading(true)

		setAuthors(await authorService.getAll(isAuthenticated))

		setIsLoading(false)
	}, [isAuthenticated])

	const memorizedValue = useMemo(() => ({
		authors,
		isLoading
	}), [authors, isLoading])

	return (
		<AuthorsContext.Provider value={memorizedValue}>
			{props.children}
		</AuthorsContext.Provider>
	)
})

export default AuthorsProvider
