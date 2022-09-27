import React, {useMemo, useState} from 'react'
import HomeContext from './HomeContext'
import WorkShort from '../../sdk.riiul-api/works/models/WorkShort'
import homeService from '../../sdk.riiul-api/home/homeService'
import useAsyncEffect from '../../service.common/helpers/useAsyncEffect'

const HomeProvider = React.memo(props => {
	const [works, setWorks] = useState<Record<number, WorkShort[]>>({})
	const [isLoading, setIsLoading] = useState(true)

	useAsyncEffect(async () => {
		setWorks(await homeService.get())
		setIsLoading(false)
	}, [])

	const memorizedValue = useMemo(() => ({
		works,
		isLoading,
	}), [works, isLoading])

	return (
		<HomeContext.Provider value={memorizedValue}>
			{props.children}
		</HomeContext.Provider>
	)
})

export default HomeProvider
