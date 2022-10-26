import {Grid} from '@mui/material'
import React, {useEffect, useMemo, useState} from 'react'
import useWorks from '../../../service.common/works/useWorks'
import { SearchBox } from '@riiul/ui.common/searchBox/SearchBox'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import WorkCard from '../../../ui.common/WorkCard/WorkCard'
import {ApiResponse} from '@riiul/sdk.riiul-api'
import {getClientSubjects, SubjectsClientResponse} from '@riiul/service.client/subject'

const WorksSearchPage = React.memo(() => {
	const { works, isLoading: isWorksLoading } = useWorks()
	const [subjectResponse, setSubjectResponse] = useState<ApiResponse<SubjectsClientResponse[]> | undefined>(undefined)

	const isLoading = useMemo(
		() => isWorksLoading || (subjectResponse === undefined || subjectResponse.isErrored),
		[isWorksLoading, subjectResponse]
	)

	useEffect(() => {
		getClientSubjects().then(setSubjectResponse).catch(console.error)
	}, [])

	if (isLoading) return <LoadingIndicator />

	return (
		<Grid container spacing={1}>
			<SearchBox subjects={subjectResponse!.data} />
			<Grid item container xs={12} sm={8} alignItems='left' spacing={1}>
				{works.map(work => <WorkCard key={work.id} work={work} />)}
			</Grid>
		</Grid>
	)
})

export default WorksSearchPage
