import {createContext, FormEvent} from 'react'
import Subject from '../../sdk.riiul-api/subjects/models/Subject'
import SubjectFormEvent from './types/SubjectFormElement'

export type SubjectContextProps = {
	subject: Subject | null
	isLoading: boolean
	save: (form: FormEvent<SubjectFormEvent>) => void
	isSaving: boolean
}

const SubjectContext = createContext({ isLoading: true, isSaving: false } as SubjectContextProps)

export default SubjectContext
