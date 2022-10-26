import {Divider, Grid, Typography} from '@mui/material'
import React from 'react'
import OutlinedContainer from '../../../../../ui.common/OutlinedContainer/OutlinedContainer'
import Dropzone from '../../../../../ui.common/Dropzone/Dropzone'
import WorkFile from '../../../../../sdk.riiul-api/works/models/WorkFile'

export type AttachmentsProps = {
	files: WorkFile[]
	images: WorkFile[]
	onFilesChange: (files: WorkFile[]) => void
	onImagesChange: (images: WorkFile[]) => void
}

const Attachments = React.memo<AttachmentsProps>((props) => {
	const { files, images, onFilesChange, onImagesChange } = props

	return (
		<Grid item xs={12}>
			<OutlinedContainer label='Manused'>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography align='left'>Pildid (Min 1 pilt)</Typography>
						<Dropzone max={3} files={images} onUpdate={onImagesChange} accept='image/jpeg' />
					</Grid>
					<Grid item xs={12}><Divider /></Grid>
					<Grid item xs={12} >
						<Typography align='left'>PDF</Typography>
						<Dropzone max={1} files={files} onUpdate={onFilesChange} accept='application/pdf'/>
					</Grid>
				</Grid>
			</OutlinedContainer>
		</Grid>
	)
})

export default Attachments
