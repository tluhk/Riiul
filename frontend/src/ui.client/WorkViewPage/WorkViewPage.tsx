import {ReactElement} from 'react'
import WorkProvider from '../../service.admin/work/WorkProvider'
import WorkView from './WorkView/WorkView'
import {RouteComponentProps} from 'react-router-dom'

const WorkViewPage = (props: RouteComponentProps<{ title?: string }>): ReactElement => {
	const { title } = props.match.params

	return (
		<WorkProvider title={title || null}>
			<WorkView />
		</WorkProvider>
	)

}

export default WorkViewPage
