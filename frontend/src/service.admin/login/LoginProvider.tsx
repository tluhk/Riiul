import React, {useEffect, useMemo, useState} from 'react'
import LoginContext, {LoginContextProps} from './LoginContext'
import {useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import authenticationService from '../../sdk.riiul-api/authentication/authenticationService'
import tokenService from '../../sdk.riiul-api/common/tokenService'

const LoginProvider = React.memo<{children: React.ReactNode}>(props => {
	const {pathname} = useLocation()
	const history = useHistory()

	const [token, setToken] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	async function logIn(email: string, password: string): Promise<void> {
		setLoading(true)
		try {
			await authenticationService.logIn(email, password)

			setToken(tokenService.getToken())
		} catch (err) {
			console.error(err)
		}

		setLoading(false)
	}

	async function logOut(): Promise<void> {
		setToken(null)
		tokenService.clearToken()

		try {
			await toast.success('Edukalt välja logitud!')

			history.push('/admin')
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		const token = tokenService.getToken()
		if (pathname.includes('/admin') && token)
			setToken(token)

		const interval = window.setInterval(() => {
			setToken(tokenService.getToken())
		}, 1000)

		return () => clearInterval(interval)
	}, [pathname])

	const providerValue = useMemo<LoginContextProps>(() => ({
		loading,
		isAuthenticated: token !== null,
		logIn,
		logOut,
	}), [token, loading])

	return (
		<LoginContext.Provider value={providerValue}>
			{props.children}
		</LoginContext.Provider>
	)
})

export default LoginProvider
