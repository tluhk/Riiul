import './Header.scss'

import React, {useMemo} from 'react'
import {Link, NavLink, useLocation} from 'react-router-dom'
import hkLogo from '../../hkLogo.svg'
import useLogin from '../../service.admin/login/useLogin'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import {AppBar, Container, Grid, Toolbar} from '@mui/material'
import {Login, Logout} from '@mui/icons-material'
import defaultPaths from './defaultPaths'

const Header = React.memo(() => {
	const { isAuthenticated, logOut } = useLogin()
	const { pathname } = useLocation()

	const isInAdminPath = useMemo(() => pathname.includes('/admin'), [pathname])

	if (isInAdminPath) return <></>

	return <AppBar position='static' className='header'>
		<Container maxWidth='xl'>
			<Toolbar>
				<Grid container>
					<Grid item container xs={10} direction='row' justifyContent='flex-start' alignItems='center'>
						<Link to={'/'} className='logo'>
							<img src={hkLogo} alt='Hakkimise kool' className='logo'/>
						</Link>
						{defaultPaths.map(({to, name}) => <Button
							activeClassName='selected'
							className='navigator-button'
							component={NavLink}
							key={name}
							to={to}>
							{name}
						</Button>)}
					</Grid>
					<Grid item container xs={2} direction='row' justifyContent='flex-end' alignItems='center'>
						{isInAdminPath && isAuthenticated
							? <IconButton className='navigator-button' onClick={logOut}><Logout /></IconButton>
							: <IconButton className='navigator-button' component={Link} to='/admin'><Login /></IconButton>
						}
					</Grid>
				</Grid>
			</Toolbar>
		</Container>
	</AppBar>
})

export default Header
