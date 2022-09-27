import BaseType from './BaseType'
import WORK_EXTERNAL_LINK from '../../enums/WORK_EXTERNAL_LINK'

type WorkExternalLinkDatabaseType = BaseType & {
	title: string
	link: string
	type: WORK_EXTERNAL_LINK
	work_id: number
}

export default WorkExternalLinkDatabaseType
