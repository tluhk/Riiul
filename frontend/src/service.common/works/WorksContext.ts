import { createContext } from 'react'
import WorkShort from '../../sdk.riiul-api/works/models/WorkShort'

export type WorkContextProps = {
	works: WorkShort[]
	isLoading: boolean
	refresh: () => void
	hideOrShow: (ids: number[]) => void
	remove: (ids: number[]) => void
}

const WorksContext = createContext({isLoading: true} as WorkContextProps)

export default WorksContext
