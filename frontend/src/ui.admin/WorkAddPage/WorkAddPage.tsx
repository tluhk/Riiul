import React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import WorkProvider from '../../service.admin/work/WorkProvider'
import WorkAdd from './WorkAdd/WorkAdd'

const WorkAddPage = React.memo<RouteComponentProps<{ title?: string }>>(({match}) => {
	const { title } = match.params

	return(
		<WorkProvider title={title || null}>
			<WorkAdd />
		</WorkProvider>
	)

})

export default WorkAddPage
