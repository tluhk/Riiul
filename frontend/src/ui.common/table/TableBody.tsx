import React, {ReactElement} from 'react'
import {TableRowProps} from '@mui/material'

export interface TableBodyProps {
	children: ReactElement<TableRowProps>[]
}

export const TableBody = React.memo<TableBodyProps>(props => {
	return (
		<tbody>
			{props.children}
		</tbody>
	)
})
