import {useContext} from 'react'
import UsersContext, {UserContextProps} from './UsersContext'

function useUsers(): UserContextProps {
	return useContext(UsersContext)
}

export default useUsers
