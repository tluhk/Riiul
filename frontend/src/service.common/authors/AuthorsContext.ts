import { createContext } from 'react'

export type AuthorsContextProps = {
	authors: string[] | null
	isLoading: boolean
}

const AuthorsContext = createContext({isLoading: true} as AuthorsContextProps)

export default AuthorsContext
