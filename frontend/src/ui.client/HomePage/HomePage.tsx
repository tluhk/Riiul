import Home from './Home/Home'
import React from 'react'
import HomeProvider from '../../service.client/home/HomeProvider'

const HomePage = React.memo(() => {
	return (
		<HomeProvider>
			<Home />
		</HomeProvider>)
})

export default HomePage
