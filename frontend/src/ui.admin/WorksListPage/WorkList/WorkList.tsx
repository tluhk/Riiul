import './WorksList.scss'

import React from 'react'
import columns from './columns'
import DataTable from '../../../ui.common/DataTable'
import useWorks from '../../../service.common/works/useWorks'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import useSubjects from '../../../service.common/subjects/useSubjects'
import {useHistory} from 'react-router-dom'

const WorksListPage = React.memo(() => {
	const history = useHistory()
	const { subjects } = useSubjects()
	const { works, remove, hideOrShow, isLoading} = useWorks()

	const rows = works?.map(work => ({
		...work,
		subject: subjects.find(speciality => speciality.id === work.subjectId)?.name || '???'
	}))

	if (isLoading) return <LoadingIndicator />

	function redirectToEdit(id: number) {
		const work = works.find(work => work.id === id)

		if (work) {
			history.push(work.editLink)
		} else {
			throw new Error('WORK_NOT_FOUND')
		}

	}

	return <DataTable
		rows={rows}
		columns={columns}
		addPath='/admin/works/add'
		onHideOrShow={hideOrShow}
		onDelete={remove}
		onClick={redirectToEdit} />
})

export default WorksListPage
