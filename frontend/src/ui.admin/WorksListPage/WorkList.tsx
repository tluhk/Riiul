import React from 'react'
import useWorks from '@riiul/service.common/works/useWorks'
import LoadingIndicator from '@riiul/ui.common/LoadingIndicator/LoadingIndicator'
import {DataTable} from '@riiul/ui.admin/shared'
import {DataTableRowItem} from '@riiul/ui.admin/shared/dataTable/DataTableHead'
import {Visibility, VisibilityOff} from '@mui/icons-material'

enum TableRowKey {
	TITLE = 'Pealkiri',
	SUBJECT = "Eriala",
	VISIBLE = 'Nähtavus'
}

const ROWS: DataTableRowItem[] = [
	{
		key: TableRowKey.TITLE
	},
	{
		key: TableRowKey.SUBJECT,
		align: 'center'
	},
	{
		key: TableRowKey.VISIBLE,
		align: 'center'
	}
]

const WorksListPage = React.memo(() => {
	const { works, isLoading} = useWorks()

	if (isLoading) return <LoadingIndicator />

	const columns = works.map(work => ({
		id: work.id,
		items: [
			{
				key: TableRowKey.TITLE,
				value: work.title
			},
			{
				key: TableRowKey.SUBJECT,
				value: '???'
			},
			{
				key: TableRowKey.VISIBLE,
				value: work.active ? <Visibility /> : <VisibilityOff />
			}
		]
	}))

	return <DataTable
		addLink='/admin/works/add'
		editLink='/admin/works/edit/:id'
		rows={ROWS}
		columns={columns}
	/>
})

export default WorksListPage
