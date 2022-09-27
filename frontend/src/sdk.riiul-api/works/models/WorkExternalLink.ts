import WORK_EXTERNAL_LINK from '../enums/WORK_EXTERNAL_LINK'
import {WorkResponseExternalLink} from '../types/WorkResponse'

class WorkExternalLink {
	readonly id: number
	readonly title: string
	readonly link: string
	readonly type: WORK_EXTERNAL_LINK

	constructor(id: number, title: string, link: string, type: WORK_EXTERNAL_LINK) {
		this.id = id
		this.title = title
		this.link = link
		this.type = type
	}

	static fromWorkResponseExternalLink(object: WorkResponseExternalLink): WorkExternalLink {
		return new WorkExternalLink(
			object.id,
			object.title,
			object.link,
			object.type
		)
	}
}

export default WorkExternalLink
