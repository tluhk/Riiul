import './DataTable.scss'

import React, {useMemo, useState} from 'react'
import {Table} from '@riiul/ui.common/table'
import {Button, Grid, Popover} from '@mui/material'
import {NavLink} from 'react-router-dom'
import {DataTableHead, DataTableRowItem} from './DataTableHead'
import {DataTableBody} from '@riiul/ui.admin/shared/dataTable/DataTableBody'
import {DataTableColumnItem} from '@riiul/ui.admin/shared/dataTable/DataTableColumn'
import {PopoverContents} from '@riiul/ui.admin/shared/dataTable/PopoverContents'

export interface DataTableProps {
	addLink: string
	editLink: string
	onDelete?: (id: string | number) => void
	rows: DataTableRowItem[]
	columns: DataTableColumnItem[]
}

export const DataTable = React.memo<DataTableProps>(props => {
	const { addLink, editLink, rows, columns, onDelete } = props
	const [anchor, setAnchor] = useState<undefined | Element>()
	const [id, setId] = useState<undefined | number | string>()

	const deleteHidden = onDelete === undefined

	const onOpen = (el: Element, id: number | string) => {
		setAnchor(el)
		setId(id)
	}

	const onClose = () => {
		setAnchor(undefined)
		setId(undefined)
	}

	const editLinkComputed = useMemo(() => {
		if (id === undefined) return "#"

		return editLink.replace(":id", id.toString())
	}, [id])

	const handleDelete = () => {
		if (deleteHidden || id === undefined) return

		onDelete(id)
	}

	const open = useMemo(() => anchor !== undefined && id !== undefined, [anchor, id])

	return (
		<Grid container className='data-table'>
			<Grid item container xs={12} justifyContent="flex-end" className='util-header'>
				<Button variant='contained' component={NavLink} to={addLink}>Lisa eriala</Button>
			</Grid>
			<Grid item xs={12}>
				<Table>
					<DataTableHead items={rows} />
					<DataTableBody rows={rows} items={columns} onClick={onOpen} />
				</Table>
			</Grid>
			<Popover
				open={open}
				anchorEl={anchor}
				onClose={onClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<PopoverContents editLink={editLinkComputed} onDelete={handleDelete} deleteHidden />
			</Popover>
		</Grid>
	)
})
