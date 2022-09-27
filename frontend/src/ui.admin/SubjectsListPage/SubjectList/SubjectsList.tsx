import React from 'react'
import DataTable from '../../../ui.common/DataTable'
import columns from './columns'
import {useHistory} from 'react-router-dom'
import useSubjects from '../../../service.common/subjects/useSubjects'

const SubjectsList = React.memo(() => {
	const history = useHistory()
	const {subjects, hideOrShow} = useSubjects()

	return <DataTable
		rows={subjects}
		columns={columns}
		addPath='/admin/subjects/add'
		onHideOrShow={hideOrShow}
		onClick={(id) => history.push(`/admin/subjects/edit/${id}`)} />
})

export default SubjectsList
