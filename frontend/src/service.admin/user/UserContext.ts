import {createContext, FormEvent} from 'react'
import User from '../../sdk.riiul-api/users/models/User'
import UserFormElement from './types/UserFormElement'

export type UserContextProps = {
	user: User | null
	isLoading: boolean
	save: (form: FormEvent<UserFormElement>) => void
	isSaving: boolean
}

const UserContext = createContext({ isLoading: true, isSaving: false } as UserContextProps)

export default UserContext
