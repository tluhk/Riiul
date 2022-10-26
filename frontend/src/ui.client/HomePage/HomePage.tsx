import { Home } from './Home/Home'
import React, {useEffect, useState} from 'react'
import HomeProvider from '../../service.client/home/HomeProvider'
import LoadingIndicator from '@riiul/ui.common/LoadingIndicator/LoadingIndicator'
import {getClientSubjects, SubjectsClientResponse} from '@riiul/service.client/subject'
import {ApiResponse} from '@riiul/sdk.riiul-api'

const HomePage = React.memo(() => {
	const [isLoading, setIsLoading] = useState(true)
	const [subjects, setSubjects] = useState<ApiResponse<SubjectsClientResponse[]> | undefined>()

	useEffect(() => {
		getClientSubjects().then(setSubjects).catch(console.error)
	}, [])

	useEffect(() => setIsLoading(false), [subjects])

	if (isLoading || subjects === undefined || subjects?.isErrored) return <LoadingIndicator />

	return (
		<HomeProvider>
			<Home subjects={subjects.data} />
		</HomeProvider>)
})

export default HomePage
