import './OutlinedContainer.scss'

import React, {ReactElement} from 'react'
import {InputLabel} from '@mui/material'
import NotchedOutline from '@mui/material/OutlinedInput/NotchedOutline'

export type OutlinedContainerProps = {
	label: string
	children: ReactElement | ReactElement[]
}

const OutlinedContainer = React.memo<OutlinedContainerProps>(({ children, label }) => {
	return (
		<div className="outlined-container">
			<InputLabel
				variant="outlined"
				className='input-label'
				shrink
			>{label}</InputLabel>
			<div className={'content-wrapper'}>
				<div className="content">
					{children}
					<NotchedOutline
						label={label}
						className="notched-outline MuiOutlinedInput-notchedOutline"
						notched
					/>
				</div>
			</div>
		</div>
	)
})

export default OutlinedContainer
