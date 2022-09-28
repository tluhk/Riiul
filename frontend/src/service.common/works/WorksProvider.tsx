import React, {useEffect, useMemo, useState} from 'react'
import WorksContext from './WorksContext'
import useLogin from '../../service.admin/login/useLogin'
import workService from '../../sdk.riiul-api/works/workService'
import {getWorkQueryProps} from './getWorkQueryProps'
import WorkShort from '../../sdk.riiul-api/works/models/WorkShort'

const WorksProvider = React.memo<{children: React.ReactNode}>(props => {
	const {isAuthenticated} = useLogin()
	const [works, setWorks] = useState<WorkShort[]>([])
	const [isLoading, setIsLoading] = useState(true)

	async function refresh() {
		setIsLoading(true)

		setWorks(await workService.getAll(getWorkQueryProps(), isAuthenticated))

		setIsLoading(false)
	}

	async function hideOrShow(ids: number[]) {
		await Promise.all(ids.map(id => {
			return workService.update(
				id,
				{active: !works.find(work => work.id === id)?.active}
			)
		}))

		refresh()
	}

	async function remove(ids: number[]) {
		await Promise.all(ids.map(id => {
			return workService.remove(id)
		}))

		refresh()
	}

	useEffect(() => {
		refresh()
	}, [isAuthenticated])

	const memorizedValue = useMemo(() => ({
		works,
		refresh,
		isLoading,
		hideOrShow,
		remove
	}), [works, isLoading])

	return (
		<WorksContext.Provider value={memorizedValue}>
			{props.children}
		</WorksContext.Provider>
	)
})

export default WorksProvider
