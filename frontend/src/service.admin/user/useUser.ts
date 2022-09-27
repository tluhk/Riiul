import {useContext} from 'react'
import UserContext, {UserContextProps} from './UserContext'

function useUser(): UserContextProps {
	return useContext(UserContext)
}

export default useUser
