import {createContext} from 'react'
import User from '../../sdk.riiul-api/users/models/User'

export type UserContextProps = {
	users: User[] | null
	isLoading: boolean
	remove: (ids: number[]) => void
}

const UsersContext = createContext({ isLoading: true } as UserContextProps)

export default UsersContext
