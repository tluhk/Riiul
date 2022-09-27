import {Grid} from '@mui/material'
import Button from '@mui/material/Button'
import {Add, Delete} from '@mui/icons-material'
import {Link} from 'react-router-dom'
import {DataGrid, GridColumns, GridRowsProp} from '@mui/x-data-grid'
import React, {useEffect, useState} from 'react'

type DataTableProps  = {
	rows?: GridRowsProp
	columns: GridColumns
	addPath: string
	onHideOrShow?: (ids: number[]) => void
	onDelete?: (ids: number[]) => void
	onClick: (id: number) => void
}

const DataTable = React.memo<DataTableProps>(({addPath, rows, columns, onHideOrShow, onDelete, onClick}) => {
	const [selected, setSelected] = useState<number[]>([])

	useEffect(() => {
		setSelected([])
	}, [rows])

	return (
		<Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start" className='admin-works-page'>
			<Grid container item xs={12}>
				<Grid container item xs={12} sm={6} spacing={2} justifyContent='flex-start'>
					{onHideOrShow && <Grid item>
						<Button disabled={!selected.length} variant='contained' onClick={() => onHideOrShow(selected)}>Peida/Näita</Button>
					</Grid>}
					{onDelete && <Grid item>
						<Button disabled={!selected.length} variant='contained' onClick={() => onDelete(selected)}>Kustuta <Delete /></Button>
					</Grid>}
				</Grid>
				<Grid container item xs={12} sm={6} justifyContent='flex-end'>
					<Grid item>
						<Button component={Link} to={addPath} variant='contained'>Lisa <Add /></Button>
					</Grid>
				</Grid>

			</Grid>
			<Grid item className='table-container' xs={12}>
				<DataGrid
					columns={columns}
					rows={rows || []}
					checkboxSelection
					disableColumnFilter
					disableSelectionOnClick
					hideFooterPagination
					loading={rows === undefined}
					onSelectionModelChange={s => setSelected(s as number[])}
					onRowClick={row => onClick(row.id as number)}
				/>
			</Grid>
		</Grid>
	)
})

export default DataTable
