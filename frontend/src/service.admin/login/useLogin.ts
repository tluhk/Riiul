import LoginContext, {LoginContextProps} from './LoginContext'
import {useContext} from 'react'

function useLogin(): LoginContextProps {
	return useContext(LoginContext)
}

export default useLogin
