import React from 'react'
import WorkList from './WorkList/WorkList'
import WorksProvider from '../../service.common/works/WorksProvider'

const WorksListPage = React.memo(() => {

	return (
		<WorksProvider>
			<WorkList />
		</WorksProvider>
	)
})

export default WorksListPage
