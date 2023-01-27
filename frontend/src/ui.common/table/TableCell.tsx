import React, {ReactElement} from 'react'

export interface TableCellProps {
	children?: string | boolean | number | ReactElement
	head?: boolean
	align?: 'center' | 'left'
}

export const TableCell = React.memo<TableCellProps>(props => {
	const {head, children, align} = props

	const classes = []
	if (align == 'center') {
		classes.push('table-cell-align-center')
	}

	const componentProps = {
		className: classes.join(" ")
	}

	if (head) {
		return <th {...componentProps}>{children}</th>
	} else {
		return <td {...componentProps}>{children}</td>
	}
})
