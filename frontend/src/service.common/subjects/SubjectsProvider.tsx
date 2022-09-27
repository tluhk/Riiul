import React, {useEffect, useMemo, useState} from 'react'
import SubjectsContext from './SubjectsContext'
import useLogin from '../../service.admin/login/useLogin'
import subjectsService from '../../sdk.riiul-api/subjects/subjectsService'
import Subject from '../../sdk.riiul-api/subjects/models/Subject'
import specialitiesService from '../../sdk.riiul-api/subjects/subjectsService'

const SubjectsProvider = React.memo(props => {
	const {isAuthenticated} = useLogin()
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [isLoading, setIsLoading] = useState(true)

	async function refresh() {
		setSubjects([])

		setSubjects(await subjectsService.getAll(isAuthenticated))
		setIsLoading(false)
	}

	async function hideOrShow(ids: number[]) {
		await Promise.all(ids.map(id => {
			const speciality = subjects.find(s => s.id === id)
			if (!speciality) throw new Error('Eriala ei leitud')

			return specialitiesService.update(id, {active: !speciality.active})
		}))

		refresh()
	}

	useEffect(() => {
		refresh()
	}, [isAuthenticated])

	const memorizedValue = useMemo(() => ({
		subjects,
		refresh,
		isLoading,
		hideOrShow
	}), [subjects, isLoading])

	return (
		<SubjectsContext.Provider value={memorizedValue}>
			{props.children}
		</SubjectsContext.Provider>
	)
})

export default SubjectsProvider
