import './ImageContainer.scss'

import React, { useState } from 'react'
import {Grid} from '@mui/material'
import WorkMedia from '../../../../sdk.riiul-api/works/models/WorkMedia'

export type ImageContainerProps = {
	medias: WorkMedia[]
}

const ImageContainer = React.memo<ImageContainerProps>(({ medias }) => {
	const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0)

	const snapshots = medias.map(((media, i) => (
		<Grid
			key={media.link}
			item
			className={`small-image-container ${activeMediaIndex === i ? 'active' : ''}`}>
			<img
				alt='snapshot-image'
				onClick={() => setActiveMediaIndex(i)}
				src={media.snapshotSrc} />
		</Grid>
	)))

	const activeMedia = medias[activeMediaIndex]

	return (
		<Grid item xs={12} className='image-container'>
			<Grid justifyContent='center' spacing={1} container>
				<Grid item xs={12} className='active-image-container'>
					{activeMedia.isImage &&
						<img className={'active-image'}
							alt='MainProductImage'
							src={activeMedia.src} />}
					{activeMedia.isYoutube && <iframe
						src={activeMedia.src}
						frameBorder='0'/>}
				</Grid>
				{snapshots}
			</Grid>
		</Grid>
	)
})

export default ImageContainer
