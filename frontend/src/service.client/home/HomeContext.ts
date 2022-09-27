import { createContext } from 'react'
import WorkShort from '../../sdk.riiul-api/works/models/WorkShort'

export type HomeContextProps = {
	works: Record<number, WorkShort[]>
	isLoading: boolean
}

const HomeContext = createContext({isLoading: true} as HomeContextProps)

export default HomeContext
