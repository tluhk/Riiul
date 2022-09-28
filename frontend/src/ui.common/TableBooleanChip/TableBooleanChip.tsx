import React from 'react'
import {Chip} from '@mui/material'
import {GridRenderCellParams} from '@mui/x-data-grid'

const TableBooleanChip = React.memo<GridRenderCellParams>(({value}) => {
	return <Chip
		label={value ? '✔' : '✘'}
		color={value ? 'success' : 'error'} />
})

export default (props: GridRenderCellParams): React.ReactElement => <TableBooleanChip {...props} />
