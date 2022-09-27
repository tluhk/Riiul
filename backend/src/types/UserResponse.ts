import UserListResponse from './UserListResponse'

type UserResponse = UserListResponse & {
	email: string
}

export default  UserResponse
