import React from 'react'
import {Chip} from '@mui/material'

export type TableBooleanChipProps = {
  value: boolean
}

const TableBooleanChip = React.memo<TableBooleanChipProps>(({value}) => {
	return <Chip
		label={value ? '✔' : '✘'}
		color={value ? 'success' : 'error'} />
})

export default (props: TableBooleanChipProps): React.ReactElement => <TableBooleanChip {...props} />
