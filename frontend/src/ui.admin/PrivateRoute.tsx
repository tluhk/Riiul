import React, {ReactElement} from 'react'
import {Route, Link, RouteProps} from 'react-router-dom'
import useLogin from '../service.admin/login/useLogin'

const PrivateRoute = ({ component: Component, ...rest }: RouteProps): ReactElement => {
	const {isAuthenticated, loading} = useLogin()

	return (
		<Route
			{...rest}
			component={isAuthenticated ? Component : () => loading ? <div /> : <Link to='/admin' />}
		/>
	)
}

export default PrivateRoute

