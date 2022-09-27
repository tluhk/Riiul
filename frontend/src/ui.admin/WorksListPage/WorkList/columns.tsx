import {GridColumns} from '@mui/x-data-grid'
import TableBooleanChip from '../../../ui.common/TableBooleanChip/TableBooleanChip'

const columns: GridColumns = [
	{field: 'title', headerName: 'Nimi', width: 350},
	{field: 'subject', headerName: 'Eriala', width: 300},
	{
		field: 'active',
		headerName: 'Nähtav',
		width: 100,
		align: 'center',
		renderCell: TableBooleanChip
	},
]

export default columns
