import {useContext} from 'react'
import TagsContext, {TagsContextProps} from './TagsContext'

function useTags(): TagsContextProps {
	return useContext(TagsContext)
}

export default useTags
