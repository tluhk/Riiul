import React, {FormEvent, ReactElement, useMemo, useState} from 'react'
import WorkContext from './WorkContext'
import htmlFormToWorkNewForm from './mappers/htmlFormToWorkNewForm'
import useAsyncEffect from '../../service.common/helpers/useAsyncEffect'
import WorkFormElement from './types/WorkFormElement'
import workService from '../../sdk.riiul-api/works/workService'
import Work, {WorkNonFormData} from '../../sdk.riiul-api/works/models/Work'
import htmlFormToWorkUpdateForm from './mappers/htmlFormToWorkUpdateForm'

export type SubjectProviderProps = {
	title: string | null
	children: ReactElement
}

const WorkProvider = React.memo<SubjectProviderProps>(props => {
	const { title, children } = props

	const [work, setWork] = useState<Work | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)

	useAsyncEffect(async () => {
		if (title === null) return setIsLoading(false)

		const res = await workService.find(title)

		setWork(res)
		setIsLoading(false)
	}, [title])

	async function save(e: FormEvent<WorkFormElement>, nonFormData: WorkNonFormData) {
		e.preventDefault()
		const isExistingUser = title && work

		setIsSaving(true)

		if (isExistingUser) {
			await workService.update(work.id, await htmlFormToWorkUpdateForm(work, e.currentTarget.elements, nonFormData))

		} else {
			await workService.add(await htmlFormToWorkNewForm(e.currentTarget.elements, nonFormData))
		}

		setIsSaving(false)

		window.location.reload()
	}

	const memorizedValue = useMemo(() => ({
		work,
		isLoading,
		save,
		isSaving
	}), [work, isSaving, isLoading])

	return (
		<WorkContext.Provider value={memorizedValue}>
			{children}
		</WorkContext.Provider>
	)
})

export default WorkProvider
