import {FormModificationType, FormNewType, FormUpdateType} from '../../common/types/FormModificationType'
import {FORM_MODIFICATION_TYPE} from '../../common/enums/FORM_MODIFICATION_TYPE'
import {WorkExternalLinkNewForm, WorkFileNewForm} from './WorkNewForm'

export type WorkUpdateFileUpdateForm = FormUpdateType<{
	order?: number
}>

export type WorkNewFileUpdateForm = FormNewType<WorkFileNewForm>

export type WorkFileUpdateForm = FormModificationType<WorkUpdateFileUpdateForm, WorkNewFileUpdateForm>

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

export type WorkUpdateExternalLinkUpdateForm = FormUpdateType<WorkExternalLinkNewForm>

export type WorkNewExternalLinkUpdateForm = FormNewType<WorkExternalLinkNewForm>

export type WorkExternalLinkUpdateForm = FormModificationType<WorkUpdateExternalLinkUpdateForm, WorkNewExternalLinkUpdateForm>

export type WorkUpdateForm = {
	subjectId?: number
	title?: string
	description?: string | null
	tags?: WorkKeywordUpdateForm[]
	authors?: WorkKeywordUpdateForm[]
	priority?: boolean
	active?: boolean
	externalLinks?: WorkExternalLinkUpdateForm[]
	graduationYear?: number | null
	images?: WorkFileUpdateForm[]
	files?: WorkFileUpdateForm[]
	isVideoPreviewImage?: boolean
}
