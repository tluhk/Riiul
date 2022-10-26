import React from 'react'
import WorkFile from '../../../sdk.riiul-api/works/models/WorkFile'
import {Divider, Grid, Paper, Typography} from '@mui/material'
import {ArticleOutlined} from '@mui/icons-material'

export type WorkFileAttachmentProps = {
	attachment: WorkFile
}

const WorkFileAttachment = React.memo<WorkFileAttachmentProps>((props) => {
	const { attachment } = props

	return (
		<Grid item style={{ width: '100%' }}>
			<a href={attachment.src} target='_blank' className='attachment-link'>
				<Paper elevation={3} key={attachment.id} className='attachment-paper'>
					<Grid container alignItems={'center'}>
						<ArticleOutlined />
						<Divider orientation='vertical' variant='middle' flexItem />
						<Grid item xs={8}>
							<Typography>{attachment.name}</Typography>
						</Grid>
					</Grid>
				</Paper>
			</a>
		</Grid>
	)
})

export default WorkFileAttachment
