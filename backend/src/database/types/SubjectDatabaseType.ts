import BaseType from './BaseType'

type SubjectDatabaseType = BaseType & {
	name: string
	active: boolean
}

export default SubjectDatabaseType
