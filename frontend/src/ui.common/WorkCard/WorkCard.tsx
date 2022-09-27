import './WorkCard.scss'

import {Grid, Paper, Typography} from '@mui/material'
import React from 'react'
import WorkShort from '../../sdk.riiul-api/works/models/WorkShort'

export type WorkCardProps = {
  work: WorkShort
}

const WorkCard = React.memo<WorkCardProps>((props) => {
	const { work } = props

	return (
		<Grid item xs={12} sm={4}>
			<Paper elevation={0} className='work-card'>
				<a style={{ textDecoration: 'none' }} href={work.viewLink}>
					<img alt={work.image} src={work.imageSrc} />
					<Typography variant='h2'>{work.title}</Typography>
				</a>
			</Paper>
		</Grid>
	)
})

export default WorkCard
