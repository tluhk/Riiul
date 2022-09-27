import {useContext} from 'react'
import SubjecContext, {SubjectContextProps} from './SubjectContext'

function useSubject(): SubjectContextProps {
	return useContext(SubjecContext)
}

export default useSubject
