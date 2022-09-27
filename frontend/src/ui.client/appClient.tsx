import React, {ReactElement} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import WorkViewPage from './WorkViewPage/WorkViewPage'
import HomePage from './HomePage/HomePage'
import WorksSearchPage from './WorksSearchPage/WorksSearchPage'
import SubjectsProvider from '../service.common/subjects/SubjectsProvider'
import Header from '../ui.common/Header/Header'
import {Container} from '@mui/material'

const App = (): ReactElement => {
	return (
		<Router forceRefresh={true}>
			<SubjectsProvider>
				<Header/>
				<Container maxWidth='md'>
					<Switch>
						<Route exact path='/' component={HomePage}/>
						<Route exact path='/works/:title' component={WorkViewPage}/>
						<Route exact path='/works' component={WorksSearchPage}/>
					</Switch>
				</Container>
			</SubjectsProvider>
		</Router>
	)
}

export default App
