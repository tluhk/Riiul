import {TableCellProps} from './TableCell'
import React, {ReactElement} from 'react'

export interface TableHeadProps {
	children: ReactElement<TableCellProps>[]
}

export const TableHead = React.memo<TableHeadProps>(props => {
	return (
		<thead>
			<tr>
				{props.children}
			</tr>
		</thead>
		)
})
