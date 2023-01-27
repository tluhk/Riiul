import React from 'react'
import { Button, Grid } from '@mui/material'
import {Delete, Edit} from '@mui/icons-material'
import {NavLink} from 'react-router-dom'

export interface PopoverContentsProps {
	editLink: string
	onDelete: () => void
	deleteHidden?: boolean
}

const ICON_PROPS = {
	sx: {
		marginRight: 1
	}
}

export const PopoverContents = React.memo<PopoverContentsProps>(props => {
	const { editLink, onDelete, deleteHidden } = props

	return (
		<Grid
			sx={{ padding: 1 }}
			container
			spacing={2}
			direction="column"
			justifyContent="center"
			alignItems="flex-start">
			<Grid item>
				<Button startIcon={<Edit {...ICON_PROPS} />} disableFocusRipple size='small' component={NavLink} to={editLink} color='inherit'>
					Muuda
				</Button>
			</Grid>
			{!deleteHidden && <Grid item>
				<Button startIcon={<Delete {...ICON_PROPS} />} disableFocusRipple size="small" onClick={onDelete} color="error">
					Kustuta
				</Button>
			</Grid>}
		</Grid>
	)
})
