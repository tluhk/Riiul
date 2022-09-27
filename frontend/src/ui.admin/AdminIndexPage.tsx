import React, {ReactElement} from 'react'
import useLogin from '../service.admin/login/useLogin'
import AdminLoginPage from './AdminLoginPage'
import {Redirect, RouteComponentProps} from 'react-router-dom'

const AdminIndexPage = (props: RouteComponentProps): ReactElement => {
	return useLogin().isAuthenticated ? <Redirect to='/admin/works' /> : <AdminLoginPage {...props}/>
}

export default AdminIndexPage
