import WorkExternalLinkSave from './WorkExternalLinkSave'

type WorkExternalLink = WorkExternalLinkSave & {
	id: number
	workId?: number
}

export default WorkExternalLink
