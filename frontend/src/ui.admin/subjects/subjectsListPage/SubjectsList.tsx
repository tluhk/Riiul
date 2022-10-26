import React from 'react'
import DataTable from '../../../ui.common/DataTable'
import columns from './columns'
import {useHistory} from 'react-router-dom'
import {SubjectAdmin} from '@riiul/service.admin'

export interface SubjectsListProps {
	subjects: SubjectAdmin[]
	hideOrShow: (ids: number[]) => void
}

export const SubjectsList = React.memo<SubjectsListProps>(props => {
	const history = useHistory()
	const { subjects, hideOrShow } = props

	return <DataTable
		rows={subjects}
		columns={columns}
		addPath='/admin/subjects/add'
		onHideOrShow={hideOrShow}
		onClick={(id) => history.push(`/admin/subjects/edit/${id}`)} />
})
