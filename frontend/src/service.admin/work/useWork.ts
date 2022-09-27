import {useContext} from 'react'
import WorkContext, {UserContextProps} from './WorkContext'

function useWork(): UserContextProps {
	return useContext(WorkContext)
}

export default useWork
