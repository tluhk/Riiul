import { createContext } from 'react'

export type LoginContextProps = {
    loading: boolean
    isAuthenticated: boolean
    logIn: (email: string, password: string) => void
    logOut: () => void
}

const LoginContext = createContext({loading: true} as LoginContextProps)

export default LoginContext
