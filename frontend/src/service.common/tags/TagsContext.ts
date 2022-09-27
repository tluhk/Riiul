import { createContext } from 'react'

export type TagsContextProps = {
	tags: string[] | null
	isLoading: boolean
}

const TagsContext = createContext({isLoading: true} as TagsContextProps)

export default TagsContext
