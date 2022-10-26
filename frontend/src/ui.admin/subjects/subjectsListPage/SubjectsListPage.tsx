import React, {useEffect, useState} from 'react'
import {SubjectsList} from './SubjectsList'
import LoadingIndicator from '@riiul/ui.common/LoadingIndicator/LoadingIndicator'
import {toast} from 'react-toastify'
import {ApiResponse} from '@riiul/sdk.riiul-api'
import {getAdminSubject, SubjectAdmin, updateSubject} from '@riiul/service.admin'

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

	async function hideOrShow(ids: number[]) {
		await Promise.all(ids.map(id => {
			return updateSubject(id, {active: !response!.data.find(s => s.id === id)!.active})
		}))

		load()
	}

	if (isLoading || response === undefined || response?.isErrored) return <LoadingIndicator />

	return <SubjectsList hideOrShow={hideOrShow} subjects={response.data} />
})
