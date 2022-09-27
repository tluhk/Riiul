import {useContext} from 'react'
import WorksContext, {WorkContextProps} from './WorksContext'

function useWorks(): WorkContextProps {
	return useContext(WorksContext)
}

export default useWorks
