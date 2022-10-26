import React, {useEffect, useState} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import WorkProvider from '../../service.admin/work/WorkProvider'
import WorkAdd from './WorkAdd/WorkAdd'
import {getAdminSubject, SubjectsAdminResponse} from '@riiul/service.admin'
import LoadingIndicator from '@riiul/ui.common/LoadingIndicator/LoadingIndicator'

const WorkAddPage = React.memo<RouteComponentProps<{ title?: string }>>(({match}) => {
	const { title } = match.params
	const [isLoading, setIsLoading] = useState(true)
	const [subjects, setSubjects] = useState<SubjectsAdminResponse | undefined>()

	useEffect(() => {
		getAdminSubject().then(setSubjects).catch(console.error)
	}, [])

	useEffect(() => setIsLoading(false), [subjects])

	if (isLoading || subjects === undefined || subjects?.isErrored) return <LoadingIndicator />

	return(
		<WorkProvider title={title || null}>
			<WorkAdd subjectsResponse={subjects} />
		</WorkProvider>
	)
})

export default WorkAddPage
