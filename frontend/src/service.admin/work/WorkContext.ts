import {createContext, FormEvent} from 'react'
import WorkFormElement from './types/WorkFormElement'
import Work, {WorkNonFormData} from '../../sdk.riiul-api/works/models/Work'

export type UserContextProps = {
	work: Work | null
	isLoading: boolean
	save: (form: FormEvent<WorkFormElement>, nonFormData: WorkNonFormData) => void
	isSaving: boolean
}

const WorkContext = createContext({ isLoading: true, isSaving: false } as UserContextProps)

export default WorkContext
