import React from 'react'
import {SubjectAdmin} from '@riiul/service.admin'
import {DataTable} from '@riiul/ui.admin/shared/dataTable'
import {DataTableRowItem} from '@riiul/ui.admin/shared/dataTable/DataTableHead'
import {Visibility, VisibilityOff} from '@mui/icons-material'

export interface SubjectsListProps {
	subjects: SubjectAdmin[]
}

enum TableRowKey {
	NAME = 'Nimi',
	VISIBLE = 'Nähtavus'
}

const ROWS: DataTableRowItem[] = [
	{
		key: TableRowKey.NAME
	},
	{
		key: TableRowKey.VISIBLE,
		align: 'center'
	}
]

export const SubjectsList = React.memo<SubjectsListProps>(props => {
	const { subjects } = props

	const columns = subjects.map(subject => ({
		id: subject.id,
		items: [
			{
				key: TableRowKey.NAME,
				value: subject.name
			},
			{
				key: TableRowKey.VISIBLE,
				value: subject.active ? <Visibility /> : <VisibilityOff />
			}
		]
	}))

	return <DataTable
		addLink='/admin/subjects/add'
		editLink='/admin/subjects/edit/:id'
		rows={ROWS}
		columns={columns} />
})
