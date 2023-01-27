import React from 'react'
import WorkList from './WorkList'
import WorksProvider from '../../service.common/works/WorksProvider'
import {Page} from '@riiul/ui.admin/shared'

const WorksListPage = React.memo(() => {

	return (
		<Page header='Tööd'>
			<WorksProvider>
				<WorkList />
			</WorksProvider>
		</Page>
	)
})

export default WorksListPage
