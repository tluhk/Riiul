import React from 'react'
import {Divider, Grid, Typography} from '@mui/material'
import WorkCard from '../../../ui.common/WorkCard/WorkCard'
import WorkShort from '../../../sdk.riiul-api/works/models/WorkShort'
import {SubjectsClientResponse} from '@riiul/service.client/subject'

export type SubjectWorksItemProps = {
	subject: SubjectsClientResponse
	works: WorkShort[]
}

const SubjectWorksItem = React.memo<SubjectWorksItemProps>((props) => {
	const { subject, works } = props

	return (
		<Grid className='row'
			item container
			spacing={2}
			direction='row'
			justifyContent='flex-start'
			alignItems='flex-start' >
			<Grid item xs={12}>
				<Typography variant='h3'>
					<a href={`/works?subjects=${subject.name}`}>
						{subject.name}
					</a>
				</Typography>
				<Divider />
			</Grid>
			{works.map(work => <WorkCard key={work.id} work={work} />)}
		</Grid>
	)
})

export default SubjectWorksItem
