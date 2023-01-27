import React, {FormEvent, useEffect, useState} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {ApiResponse} from '@riiul/sdk.riiul-api'
import {updateSubject, addSubject, SubjectAdmin, findSubject} from '@riiul/service.admin'
import {SubjectForm} from './SubjectForm'
import LoadingIndicator from '@riiul/ui.common/LoadingIndicator/LoadingIndicator'
import {toast} from 'react-toastify'
import toastPromiseError from '@riiul/service.common/helpers/toastPromiseError'
import { htmlFormToSubjectUpdateForm } from './mappers/htmlFormToSubjectUpdateForm'
import {SubjectFormElement} from './models/SubjectFormElement'
import {htmlFormToSubjectNewForm} from './mappers/htmlFormToSubjectNewForm'
import {Page} from '@riiul/ui.admin/shared'

export const SubjectsAddPage = React.memo<RouteComponentProps<{ id?: string }>>((props) => {
	const { id } = props.match.params

	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [response, setResponse] = useState<ApiResponse<SubjectAdmin> | undefined>(undefined)

	useEffect(() => {
		if (!id) setIsLoading(false)
		else findSubject(parseInt(id))
			.then(setResponse)
			.finally(() => setIsLoading(false))
			.catch(() => toast.error('Midagi läks valesti, proovi hiljem uuesti'))
	}, [])

	useEffect(() => {
		if (response && response.isErrored) toast.error('Eriala ei ole')
	}, [response])

	async function save(e: FormEvent<SubjectFormElement>) {
		e.preventDefault()

		setIsSaving(true)

		await toast.promise(async () => {
			if (id && response) {
				await updateSubject(parseInt(id), htmlFormToSubjectUpdateForm(e.currentTarget.elements, response.data))
			} else {
				await addSubject(htmlFormToSubjectNewForm(e.currentTarget.elements))
			}
		}, {
			pending: 'Eriala salvestamine...',
			success: 'Eriala salvestamine õnnestus',
			error: toastPromiseError
		})

		setIsSaving(false)
		window.location.reload()
	}

	if (isLoading || response?.isErrored) return <LoadingIndicator />

	return<Page header={response?.data.name || "Lisa eriala"}>
		<SubjectForm
			save={save}
			defaultSubject={response?.data}
			isSaving={isSaving}
		/>
	</Page>
})
