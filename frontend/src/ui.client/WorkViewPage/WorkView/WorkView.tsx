import './WorkView.scss'

import React from 'react'
import {Grid, Typography} from '@mui/material'
import ImageContainer from './ImageContainer/ImageContainer'
import useWork from '../../../service.admin/work/useWork'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import WorkAttachments from './WorkAttachments'
import {SubjectsClientResponse} from '@riiul/service.client/subject'

const WorkViewPage = React.memo(() => {
	const { work, isLoading } = useWork()

	if (isLoading) return <LoadingIndicator />

	const subject = { } as SubjectsClientResponse

	return (
		<Grid className='work-view' container>
			<Grid item xs={12}>
				<Typography variant='h2'>
					<a href={`/works?subjects=${subject.name}`}>
						{subject.name}
					</a>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<h1>{work?.titleWithGraduation}</h1>
			</Grid>
			<Grid item xs={12}>
				<Typography variant='h2'>
					<Grid container spacing={1}>
						{work?.authors.map((author) => (
							<Grid item>
								<a className='author' href={`/works?authors=${author}`}>
									{author}
								</a>
							</Grid>
						))}
					</Grid>
				</Typography>
			</Grid>
			<ImageContainer medias={work?.media || []} />
			<Grid container item xs={12} justifyContent='center'>
				<Grid item xs={12} sm={work?.hasAttachments ? 7 : 12}>
					<Typography>
						{work?.description}&nbsp
						{work?.tags.map(tag => (
							<><a className='author' href={`/works?tags=${tag}`}>{tag}</a>&nbsp</>
						))}
					</Typography>
				</Grid>
				<WorkAttachments attachments={work?.attachments || []} />
			</Grid>
		</Grid>
	)
})

export default WorkViewPage
