import React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import UserProvider from '../../service.admin/user/UserProvider'
import UsersAdd from './UserAdd/UsersAdd'

const UsersAddPage = React.memo<RouteComponentProps<{ id?: string }>>(({match}) => {
	const { id } = match.params

	return (
		<UserProvider id={id ? parseInt(id) : null}>
			<UsersAdd />
		</UserProvider>
	)
})

export default UsersAddPage
