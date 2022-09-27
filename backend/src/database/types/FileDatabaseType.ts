import BaseType from './BaseType'

type FileDatabaseType = BaseType & {
	name: string
	extension: string
	original_name: string
	work_order: number
	work_id: number
	type: string
}

export default FileDatabaseType
