import React, {ReactElement} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import LoginProvider from './../service.admin/login/LoginProvider'
import SubjectsProvider from './../service.common/subjects/SubjectsProvider'
import Header from './../ui.common/Header/Header'
import WorksListPage from './WorksListPage/WorksListPage'
import AdminIndexPage from './AdminIndexPage'
import PrivateRoute from './PrivateRoute'
import {Container} from '@mui/material'
import WorkAddPage from './WorkAddPage/WorkAddPage'
import UsersListPage from './UsersListPage/UsersListPage'
import UsersAddPage from './UsersAddPage/UsersAddPage'
import AdminSpecialitiesListPage from './SubjectsListPage/SubjectsListPage'
import SubjectsAddPage from './SubjectsAddPage/SubjectsAddPage'

const App = (): ReactElement => {
	return (
		<Router forceRefresh={true}>
			<LoginProvider>
				<SubjectsProvider>
					<Header/>
					<Container maxWidth='md'>
						<Switch>
							<Route exact path='/admin' component={AdminIndexPage}/>

							<PrivateRoute exact path='/admin/users' component={UsersListPage} />
							<PrivateRoute exact path='/admin/users/edit/:id' component={UsersAddPage} />
							<PrivateRoute exact path='/admin/users/add' component={UsersAddPage} />

							<PrivateRoute exact path='/admin/subjects' component={AdminSpecialitiesListPage} />
							<PrivateRoute exact path="/admin/subjects/edit/:id" component={SubjectsAddPage}/>
							<PrivateRoute exact path='/admin/subjects/add' component={SubjectsAddPage} />

							<PrivateRoute exact path='/admin/works' component={WorksListPage} />
							<PrivateRoute exact path='/admin/works/edit/:title' component={WorkAddPage} />
							<PrivateRoute exact path='/admin/works/add' component={WorkAddPage} />

							<PrivateRoute path='/admin' component={AdminIndexPage} />
						</Switch>
					</Container>
				</SubjectsProvider>
			</LoginProvider>
		</Router>
	)
}

export default App
