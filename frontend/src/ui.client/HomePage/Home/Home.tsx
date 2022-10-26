import './Home.scss'

import React from 'react'
import {Grid} from '@mui/material'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import SubjectWorksItem from './SubjectWorksItem'
import useHome from '../../../service.client/home/useHome'
import {SubjectsClientResponse} from '@riiul/service.client/subject'

export interface HomeProps {
	subjects: SubjectsClientResponse[]
}

export const Home = React.memo<HomeProps>(props => {
	const { works, isLoading: isWorksLoading } = useHome()

	if (isWorksLoading) return <LoadingIndicator />

	const SubjectWorksItemList = props.subjects
		.filter(s => works[s.id]?.length)
		.map((s) => <SubjectWorksItem key={s.id} subject={s} works={works[s.id]} />)

	return(
		<Grid container direction='column' justifyContent='center' alignItems='center' className='home-page'>
			{SubjectWorksItemList}
		</Grid>
	)
})
