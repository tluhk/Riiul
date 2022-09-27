import {useContext} from 'react'
import HomeContext, {HomeContextProps} from './HomeContext'

function useHome(): HomeContextProps {
	return useContext(HomeContext)
}

export default useHome
