import React, {useEffect, useState} from 'react'
import {SubjectsList} from './SubjectsList'
import LoadingIndicator from '@riiul/ui.common/LoadingIndicator/LoadingIndicator'
import {toast} from 'react-toastify'
import {ApiResponse} from '@riiul/sdk.riiul-api'
import {getAdminSubject, SubjectAdmin} from '@riiul/service.admin'
import {Page} from '@riiul/ui.admin/shared'

export const SubjectsListPage = React.memo(() => {
	const [isLoading, setIsLoading] = useState(true)
	const [response, setResponse] = useState<ApiResponse<SubjectAdmin[]> | undefined>(undefined)

	function load() {
		getAdminSubject().then(setResponse).catch(console.error)
	}

	useEffect(() => {
		load()
	}, [])

	useEffect(() => {
		if (response && response.isErrored) toast.error(response.errors[0])
		else setIsLoading(false)
	}, [response])

	if (isLoading || response === undefined || response?.isErrored) return <LoadingIndicator />

	return (
		<Page header='Erialad'>
			<SubjectsList subjects={response.data} />
		</Page>
	)
})
