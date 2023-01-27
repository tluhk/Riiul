import React, {ReactElement} from 'react'
import {TableCell, TableRow} from '@riiul/ui.common/table'
import {IconButton} from '@mui/material'
import {MoreVertOutlined} from '@mui/icons-material'
import {DataTableRowItem} from './DataTableHead'

export interface DataTableItem {
	key: string,
	value: string | ReactElement
}

export interface DataTableColumnItem {
	id: string | number
	items: DataTableItem[]
}

export interface DataTableColumnProps {
	rows: DataTableRowItem[]
	item: DataTableColumnItem
	onClick: (el: Element, id: string | number) => void
}

export const DataTableColumn = React.memo<DataTableColumnProps>(props => {
	const {rows, item: { id, items }, onClick} = props

	const cells = rows.map(row => {
		return <TableCell key={`${id}-${row.key}`} align={row.align}>{items.find(x => x.key === row.key)?.value}</TableCell>
	})

	cells.push(
		<TableCell key={`${id}-more`} align='center'>
			<IconButton onClick={value => onClick(value.currentTarget, id)}>
				<MoreVertOutlined/>
			</IconButton>
		</TableCell>
	)

	return (
		<TableRow>
			{cells}
		</TableRow>
	)
})
