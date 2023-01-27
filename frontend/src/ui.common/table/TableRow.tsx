import {TableCellProps} from './TableCell'
import React, {ReactElement} from 'react'

export interface TableDataProps {
	children: ReactElement<TableCellProps>[]
}

export const TableRow = React.memo<TableDataProps>(props => {
	return <tr>
		{props.children}
	</tr>
})
