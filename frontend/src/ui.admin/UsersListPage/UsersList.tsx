import React from 'react'
import {DataTable} from '@riiul/ui.admin/shared'
import useUsers from '@riiul/service.admin/users/useUsers'
import LoadingIndicator from '@riiul/ui.common/LoadingIndicator/LoadingIndicator'

enum TableRowKey {
	NAME = "Nimi",
}

const ROWS = [
	{
		key: TableRowKey.NAME
	}
]

const UsersList = React.memo(() => {
	const {users, isLoading } = useUsers()

	if (isLoading) return <LoadingIndicator />

	const columns = (users || []).map(user => ({
		id: user.id,
		items: [
			{
				key: TableRowKey.NAME,
				value: user.name
			}
		]
	}))

	return <DataTable
			addLink="/admin/users/add"
			editLink="/admin/users/edit/:id"
			rows={ROWS}
			columns={columns} />
})

export default UsersList
