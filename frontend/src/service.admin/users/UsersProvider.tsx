import React, { useMemo, useState} from 'react'
import UsersContext from './UsersContext'
import usersService from '../../sdk.riiul-api/users/usersService'
import useAsyncEffect from '../../service.common/helpers/useAsyncEffect'
import User from '../../sdk.riiul-api/users/models/User'

const UsersProvider = React.memo<{children: React.ReactNode}>(props => {
	const { children } = props

	const [users, setUsers] = useState<User[] | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	async function refresh() {
		setIsLoading(true)

		const res = await usersService.getAll()

		setUsers(res)
		setIsLoading(false)
	}

	useAsyncEffect(async () => await refresh(), [])

	async function remove(ids: number[]) {
		await Promise.all(ids.map(id => {
			return usersService.remove(id)
		}))

		await refresh()
	}

	const memorizedValue = useMemo(() => ({
		users,
		isLoading: isLoading,
		remove
	}), [users, isLoading])

	return (
		<UsersContext.Provider value={memorizedValue}>
			{children}
		</UsersContext.Provider>
	)
})

export default UsersProvider
