import React from 'react'
import DataTable from '../../../ui.common/DataTable'
import columns from './columns'
import useUsers from '../../../service.admin/users/useUsers'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import {useHistory} from 'react-router-dom'

const UsersList = React.memo(() => {
	const history = useHistory()
	const {users, isLoading, remove } = useUsers()

	if (isLoading) return <LoadingIndicator />

	return <DataTable
		rows={users || []}
		columns={columns}
		addPath='/admin/users/add'
		onDelete={remove}
		onClick={(id: number) => history.push(`/admin/users/edit/${id}`)} />
})

export default UsersList
