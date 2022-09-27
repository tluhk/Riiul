import React, {FormEvent, ReactElement, useMemo, useState} from 'react'
import UserContext from './UserContext'
import {toast} from 'react-toastify'
import toastPromiseError from '../../service.common/helpers/toastPromiseError'
import htmlFormToUserNewForm from './mappers/htmlFormToUserNewForm'
import htmlFormToUserUpdateForm from './mappers/htmlFormToUserUpdateForm'
import usersService from '../../sdk.riiul-api/users/usersService'
import useAsyncEffect from '../../service.common/helpers/useAsyncEffect'
import User from '../../sdk.riiul-api/users/models/User'
import UserFormElement from './types/UserFormElement'
import {useHistory} from 'react-router-dom'

export type SubjectProviderProps = {
	id: number | null
	children: ReactElement
}

const UserProvider = React.memo<SubjectProviderProps>(props => {
	const { id, children } = props

	const history = useHistory()

	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)

	useAsyncEffect(async () => {
		if (id === null) return setIsLoading(false)

		const res = await usersService.find(id)
		console.log(res)

		setUser(res)
		setIsLoading(false)
	}, [id])

	async function save(e: FormEvent<UserFormElement>) {
		e.preventDefault()

		const isExistingUser = id && user

		setIsSaving(true)

		await toast.promise(async () => {
			if (isExistingUser) {
				await usersService.update(id, htmlFormToUserUpdateForm(e.currentTarget.elements, user))
			} else {
				await usersService.add(htmlFormToUserNewForm(e.currentTarget.elements))
			}
		}, {
			pending: 'Kasutaja salvestamine...',
			success: 'Kasutaja salvestamine õnnestus',
			error: toastPromiseError
		})

		setIsSaving(false)

		if (isExistingUser) {
			window.location.reload()
		} else {
			history.push('/admin/users')
		}
	}

	const memorizedValue = useMemo(() => ({
		user,
		isLoading: isLoading,
		save,
		isSaving
	}), [user, isSaving, isLoading])

	return (
		<UserContext.Provider value={memorizedValue}>
			{children}
		</UserContext.Provider>
	)
})

export default UserProvider
