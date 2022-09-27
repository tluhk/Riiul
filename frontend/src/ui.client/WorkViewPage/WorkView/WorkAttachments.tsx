import React from 'react'
import WorkFile from '../../../sdk.riiul-api/works/models/WorkFile'
import WorkExternalLink from '../../../sdk.riiul-api/works/models/WorkExternalLink'
import {Divider, Grid} from '@mui/material'
import WorkFileAttachment from './WorkFileAttachment'
import WorkLinkAttachment from './WorkLinkAttachment'

export type WorkAttachmentsProps = {
	attachments: (WorkFile | WorkExternalLink)[];
}

const WorkAttachments = React.memo<WorkAttachmentsProps>((props) => {
	const { attachments } = props

	const hasAttachments = attachments.length > 0

	return (
		<>
			{hasAttachments && <Divider orientation="vertical" variant="middle" flexItem style={{margin: '0 1em'}}/>}
			<Grid item container xs={12} sm={4} spacing={2}>
				{attachments.map((attachment) => {
					if (attachment instanceof WorkFile) {
						return <WorkFileAttachment attachment={attachment} key={attachment.id} />
					} else {
						return <WorkLinkAttachment attachment={attachment} key={attachment.id} />
					}
				})}
			</Grid>
		</>
	)
})

export default WorkAttachments
