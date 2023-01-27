import './table.scss'

import {TableHeadProps} from './TableHead'
import React, {ReactElement} from 'react'
import {TableDataProps} from './TableRow'

export interface TableProps {
	children: ReactElement<TableHeadProps | TableDataProps>[]
}

export const Table = React.memo(props => {
	return <table>
		{props.children}
	</table>
})
