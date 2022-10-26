import './App.scss'
import 'react-toastify/dist/ReactToastify.css'

import React, {ReactElement} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Adapter from '@mui/lab/AdapterLuxon'
import {ToastContainer} from 'react-toastify'
import AppAdmin from './ui.admin/appAdmin'
import AppClient from './ui.client/appClient'
import {ConfigProvider} from './shared'

const App = (): ReactElement => {
	return (
		<ConfigProvider>
			<Router forceRefresh={true}>
				<LocalizationProvider dateAdapter={Adapter}>
					<div className='App'>
						<Switch>
							<Route path='/admin' component={AppAdmin}/>
							<Route path={'/'} component={AppClient}/>
						</Switch>
					</div>
				</LocalizationProvider>
				<ToastContainer position='top-center' autoClose={3000} hideProgressBar />
			</Router>
		</ConfigProvider>
	)
}

export default App
