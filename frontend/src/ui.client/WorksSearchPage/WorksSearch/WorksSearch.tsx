import {Grid} from '@mui/material'
import React from 'react'
import useWorks from '../../../service.common/works/useWorks'
import SearchBox from '../../../ui.common/SearchBox/SearchBox'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import WorkCard from '../../../ui.common/WorkCard/WorkCard'

const WorksSearchPage = React.memo(() => {
	const { works, isLoading } = useWorks()

	if (isLoading) return <LoadingIndicator />

	return (
		<Grid container spacing={1}>
			<SearchBox />
			<Grid item container xs={12} sm={8} alignItems='left' spacing={1}>
				{works.map(work => <WorkCard key={work.id} work={work} />)}
			</Grid>
		</Grid>
	)
})

export default WorksSearchPage
