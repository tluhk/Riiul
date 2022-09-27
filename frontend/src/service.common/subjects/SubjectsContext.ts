import { createContext } from 'react'
import Subject from '../../sdk.riiul-api/subjects/models/Subject'

export type SubjectsContextProps = {
	subjects: Subject[]
	isLoading: boolean
	refresh: () => void
	hideOrShow: (ids: number[]) => void
}

const SubjectsContext = createContext({isLoading: true} as SubjectsContextProps)

export default SubjectsContext
