import React, {FormEvent, ReactElement, useEffect, useMemo, useState} from 'react'
import SubjectContext from './SubjectContext'
import useSubjects from '../../service.common/subjects/useSubjects'
import {toast} from 'react-toastify'
import Subject from '../../sdk.riiul-api/subjects/models/Subject'
import subjectsService from '../../sdk.riiul-api/subjects/subjectsService'
import toastPromiseError from '../../service.common/helpers/toastPromiseError'
import SubjectFormEvent from './types/SubjectFormElement'
import htmlFormToSubjectNewForm from './mappers/htmlFormToSubjectNewForm'
import htmlFormToSubjectUpdateForm from './mappers/htmlFormToSubjectUpdateForm'

export type SubjectProviderProps = {
	id: number | null
	children: ReactElement
}

const SubjectProvider = React.memo<SubjectProviderProps>(props => {
	const { id, children } = props
	const { subjects, isLoading: isSubjectsLoading } = useSubjects()

	const [subject, setSubject] = useState<Subject | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)

	useEffect(() => {
		if (isSubjectsLoading) return
		if (id === null) return setIsLoading(false)

		const res = subjects.find(s => s.id === id)

		if (res) {
			setSubject(res)
			setIsLoading(false)
		} else {
			toast.error('Eriala ei ole')
		}

	}, [isSubjectsLoading, id])

	async function save(e: FormEvent<SubjectFormEvent>) {
		e.preventDefault()

		setIsSaving(true)

		await toast.promise(async () => {
			if (id && subject) {
				await subjectsService.update(id, htmlFormToSubjectUpdateForm(e.currentTarget.elements, subject))
			} else {
				await subjectsService.add(htmlFormToSubjectNewForm(e.currentTarget.elements))
			}
		}, {
			pending: 'Eriala salvestamine...',
			success: 'Eriala salvestamine õnnestus',
			error: toastPromiseError
		})

		setIsSaving(false)
		window.location.reload()
	}

	const memorizedValue = useMemo(() => ({
		subject,
		isLoading: isLoading || isSubjectsLoading,
		save,
		isSaving
	}), [subject, isSaving, isLoading, isSubjectsLoading])

	return (
		<SubjectContext.Provider value={memorizedValue}>
			{children}
		</SubjectContext.Provider>
	)
})

export default SubjectProvider
