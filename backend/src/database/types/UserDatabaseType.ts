import BaseType from './BaseType'

type UserDatabaseType = BaseType & {
	name: string
	email: string
	password: string
}

export default UserDatabaseType
