import UserResponse from '../types/UserResponse'

class User {
	id: number
	name: string
	email: string | null

	constructor(id: number, name: string, email: string | null = null) {
		this.id = id
		this.name = name
		this.email = email
	}

	static fromResponse(json: UserResponse): User {
		return new User(
			json.id,
			json.name,
			json.email
		)
	}
}

export default User
