import React from 'react'
import {Divider, Grid, Paper, Typography} from '@mui/material'
import {LinkOutlined} from '@mui/icons-material'
import WorkExternalLink from '../../../sdk.riiul-api/works/models/WorkExternalLink'

export type WorkLinkAttachmentProps = {
	attachment: WorkExternalLink;
}

const WorkLinkAttachment = React.memo<WorkLinkAttachmentProps>((props) => {
	const { attachment } = props

	return (
		<Grid item style={{ width: '100%' }}>
			<a href={attachment.link} target="_blank" className='attachment-link'>
				<Paper elevation={3} key={attachment.id} className='attachment-paper'>
					<Grid container>
						<LinkOutlined />
						<Divider orientation="vertical" variant="middle" flexItem />
						<Typography>{attachment.title}</Typography>
					</Grid>
				</Paper>
			</a>
		</Grid>
	)
})

export default WorkLinkAttachment
