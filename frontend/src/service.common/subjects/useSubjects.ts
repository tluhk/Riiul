import {useContext} from 'react'
import SubjectsContext, {SubjectsContextProps} from './SubjectsContext'

function useSubjects(): SubjectsContextProps {
	return useContext(SubjectsContext)
}

export default useSubjects
