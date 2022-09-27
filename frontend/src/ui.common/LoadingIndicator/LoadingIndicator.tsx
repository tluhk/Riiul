import './LoadingIndicator.scss'

import {CircularProgress, Grid} from '@mui/material'
import React from 'react'

const LoadingIndicator = React.memo(() => {
	return (
		<Grid className='loading-indicator' container justifyContent="center" alignItems="center">
			<CircularProgress />
		</Grid>
	)
})

export default LoadingIndicator
