import React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import SubjectProvider from '../../service.admin/subject/SubjectProvider'
import SubjectsAdd from './SubjectsAdd/SubjectsAdd'

const SubjectsAddPage = React.memo<RouteComponentProps<{ id?: string }>>((props) => {
	const { id } = props.match.params

	return (
		<SubjectProvider id={id ? parseInt(id) : null}>
			<SubjectsAdd />
		</SubjectProvider>
	)
})

export default SubjectsAddPage
