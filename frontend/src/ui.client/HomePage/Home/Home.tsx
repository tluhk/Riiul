import './Home.scss'

import React, { ReactElement } from 'react'
import useSubjects from '../../../service.common/subjects/useSubjects'
import {Grid} from '@mui/material'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import SubjectWorksItem from './SubjectWorksItem'
import useHome from '../../../service.client/home/useHome'

const Specialities = (): ReactElement => {
	const { works, isLoading: isWorksLoading } = useHome()
	const { subjects, isLoading: isSubjectsLoading } = useSubjects()

	if (isWorksLoading || isSubjectsLoading) return <LoadingIndicator />

	const SubjectWorksItemList = subjects
		.filter(s => works[s.id]?.length)
		.map((s) => <SubjectWorksItem key={s.id} subject={s} works={works[s.id]} />)

	return(
		<Grid container direction='column' justifyContent='center' alignItems='center' className='home-page'>
			{SubjectWorksItemList}
		</Grid>
	)
}

export default Specialities
