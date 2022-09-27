import {Files} from './WorkPostBody'
import FORM_MODIFICATION_TYPE from '../enums/FORM_MODIFiCATION_TYPE'
import WorkExternalLinkSave from './WorkExternalLinkSave'

type DeleteWorkAddons = {
	id: number
	modificationType: FORM_MODIFICATION_TYPE.DELETE
}

type UpdateWorkAddons<T> = T & {
	id: number
	modificationType: FORM_MODIFICATION_TYPE.UPDATE
}

type AddWorkAddons<T> = T & {
	modificationType: FORM_MODIFICATION_TYPE.NEW
}

export type ModifyWorkAddons<A, U> =
	AddWorkAddons<A> |
	UpdateWorkAddons<U> |
	DeleteWorkAddons

export type WorkFileUpdateBody = ModifyWorkAddons<Files & { order: number }, { order: number }>
export type WorkExternalLinkUpdateBody = ModifyWorkAddons<WorkExternalLinkSave, WorkExternalLinkSave>

export type WorkNewKeywordUpdateForm = {
	name: string
	modificationType: FORM_MODIFICATION_TYPE.NEW
}

export type WorkDeleteKeywordUpdateForm = {
	name: string
	modificationType: FORM_MODIFICATION_TYPE.DELETE
}

export type WorkKeywordUpdateForm = (
	WorkDeleteKeywordUpdateForm |
	WorkNewKeywordUpdateForm
	)

export type WorkUpdateBody = {
	subjectId?: number
	title?: string
	description?: string
	tags?: WorkKeywordUpdateForm[]
	authors?: WorkKeywordUpdateForm[]
	priority?: boolean
	active?: boolean
	externalLinks?: WorkExternalLinkUpdateBody[]
	graduationYear?: number
	images?: WorkFileUpdateBody[]
	files?: WorkFileUpdateBody[]
}

export default WorkUpdateBody
