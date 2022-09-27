import React from 'react'
import WorksProvider from '../../service.common/works/WorksProvider'
import WorkSearch from './WorksSearch/WorksSearch'

const WorksSearchPage = React.memo(() => {
	return (
		<WorksProvider>
			<WorkSearch />
		</WorksProvider>
	)
})

export default WorksSearchPage
