import './Page.scss'

import React, {ReactElement} from 'react'
import {Grid, Typography} from '@mui/material'
import {NavLink} from 'react-router-dom'
import Button from '@mui/material/Button'
import paths from './paths'

export interface PageProps {
	header: string
	children: ReactElement
}

export const Page = React.memo<PageProps>(props => {
	const { header, children } = props

	return (
		<Grid container className='page'>
			<Grid item container xs={12} alignItems="center" className='header'>
				<Typography variant='h1'>{header}</Typography>
			</Grid>
			<Grid item container xs={12} className='container'>
				<Grid item container xs={12} direction='row' justifyContent='flex-start' alignItems='center' className='navbar'>
					{paths.map(({to, name}) => <Button
						activeClassName='selected'
						className='navigator-button'
						component={NavLink}
						key={name}
						to={to}>
						<Typography variant='h3'>
							{name}
						</Typography>
					</Button>)}
				</Grid>
				<Grid item xs={12}>
					{children}
				</Grid>
			</Grid>
		</Grid>
	)
})
