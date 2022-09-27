import React from 'react'
import UsersList from './UsersList/UsersList'
import UsersProvider from '../../service.admin/users/UsersProvider'

const UsersListPage = React.memo(() => {

	return (
		<UsersProvider>
			<UsersList />
		</UsersProvider>)
})

export default UsersListPage
