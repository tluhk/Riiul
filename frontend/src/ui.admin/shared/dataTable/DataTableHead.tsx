import {TableCell, TableHead} from '@riiul/ui.common/table'
import React from 'react'

export interface DataTableRowItem {
	key: string
	align?: 'left' | 'center'
}

export interface DataTableHeadProps {
 items: DataTableRowItem[]
}

export const DataTableHead = React.memo<DataTableHeadProps>(props => {
	const { items } = props

	const cells = [...items]
	cells.push({ key: "" })

	console.log(cells)

	return (
			<TableHead>
				{cells.map(item => <TableCell key={item.key}>{item.key}</TableCell>)}
			</TableHead>
		)
})
