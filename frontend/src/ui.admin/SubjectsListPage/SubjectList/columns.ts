import {GridColumns} from '@mui/x-data-grid'
import TableBooleanChip from '../../../ui.common/TableBooleanChip/TableBooleanChip'

const columns: GridColumns = [
	{field: 'name', headerName: 'Nimi', width: 650},
	{
		field: 'active',
		headerName: 'Nähtav',
		width: 100,
		align: 'center',
		renderCell: TableBooleanChip
	}
]

export default columns
