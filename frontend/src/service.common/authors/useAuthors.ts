import {useContext} from 'react'
import AuthorsContext, {AuthorsContextProps} from './AuthorsContext'

function useAuthors(): AuthorsContextProps {
	return useContext(AuthorsContext)
}

export default useAuthors
