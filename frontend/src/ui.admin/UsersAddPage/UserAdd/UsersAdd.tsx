import './UsersAdd.scss'

import React, {ChangeEvent, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Button from '@mui/material/Button'
import {Collapse, Grid, TextField} from '@mui/material'
import useUser from '../../../service.admin/user/useUser'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import {LoadingButton} from '@mui/lab'

const UsersAdd = React.memo(() => {
	const {user, isLoading, save, isSaving} = useUser()
	const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = React.useState(false)

	useEffect(() => {
		if (user !== null) setIsConfirmPasswordHidden(true)
	}, [user])

	function onPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		if (user !== null) {
			setIsConfirmPasswordHidden(event.currentTarget.value === '')
		}
	}

	if (isLoading) return <LoadingIndicator />

	return (
		<form onSubmit={save} >
			<Grid container direction='column' alignItems='center' spacing={2} className='users-add-page'>
				<Grid item>
					<TextField
						label='Nimi'
						fullWidth
						defaultValue={user?.name || ''}
						name='name' />
				</Grid>
				<Grid item>
					<TextField
						label='Email'
						fullWidth
						name='email'
						defaultValue={user?.email || ''}
						autoComplete='new-email' />
				</Grid>
				<Grid item>
					<TextField
						label='Parool'
						type='password'
						fullWidth
						name='password'
						autoComplete='new-password'
						onChange={onPasswordChange} />
				</Grid>
				<Grid item>
					<Collapse in={!isConfirmPasswordHidden}>
						<TextField
							label='Korda parooli'
							type='password'
							fullWidth
							name='passwordConfirmation' />
					</Collapse>
				</Grid>
				<Grid item container direction='row'>
					<Grid item xs={6}>
						<Button className={'button-back'} variant='contained' component={Link} to='/admin/users'>Tagasi</Button>
					</Grid>
					<Grid item xs={6}>
						<LoadingButton
							type='submit'
							disabled={isSaving}
							loading={isSaving}
							loadingPosition='start'
							className='button-submit'
							variant='contained'>Salvesta</LoadingButton>
					</Grid>
				</Grid>
			</Grid>
		</form>
	)
})

export default UsersAdd
