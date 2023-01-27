import React from 'react'
import UsersList from './UsersList'
import UsersProvider from '../../service.admin/users/UsersProvider'
import {Page} from '@riiul/ui.admin/shared'

const UsersListPage = React.memo(() => {

	return (
		<UsersProvider>
			<Page header="Kasutajad">
				<UsersList />
			</Page>
		</UsersProvider>)
})

export default UsersListPage
