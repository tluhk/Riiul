import {FORM_MODIFICATION_TYPE} from '../enums/FORM_MODIFICATION_TYPE'

export type FormUpdateType<T> = T & {
	id: number
	modificationType: FORM_MODIFICATION_TYPE.UPDATE
}

export type FormDeleteType = {
	id: number
	modificationType: FORM_MODIFICATION_TYPE.DELETE
}

export type FormNewType<T> = T & {
	modificationType: FORM_MODIFICATION_TYPE.NEW
}

export type FormModificationType<U, N> = U | N | FormDeleteType
