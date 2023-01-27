import {TableBody} from '@riiul/ui.common/table'
import React from 'react'
import {DataTableRowItem} from './DataTableHead'
import {DataTableColumn, DataTableColumnItem} from './DataTableColumn'

export interface DataTableBodyProps {
	rows: DataTableRowItem[]
	items: DataTableColumnItem[]
	onClick: (el: Element, id: string | number) => void
}

export const DataTableBody = React.memo<DataTableBodyProps>(props => {
	const { rows, items, onClick } = props

	return (
		<TableBody>
			{items.map(item => <DataTableColumn key={item.id} item={item} rows={rows} onClick={onClick} />)}
		</TableBody>
	)
})
