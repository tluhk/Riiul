import './SubjectForm.scss'

import React, {FormEvent} from 'react'
import {Link} from 'react-router-dom'
import Button from '@mui/material/Button'
import {FormControlLabel, Grid, Switch, TextField} from '@mui/material'
import {LoadingButton} from '@mui/lab'
import {SubjectAdmin} from '@riiul/service.admin'
import {SubjectFormElement} from './models/SubjectFormElement'

export interface SubjectFormProps {
	save: (e: FormEvent<SubjectFormElement>) => void
	defaultSubject?: SubjectAdmin
	isSaving: boolean
}

export const SubjectForm = React.memo<SubjectFormProps>(props => {
	const { save, defaultSubject, isSaving } = props

	return (
		<form onSubmit={save} >
			<Grid container direction='column' alignItems='center' spacing={8} className='specialities-add-page'>
				<Grid item>
					<TextField
						label='Nimi'
						fullWidth
						name='name'
						defaultValue={defaultSubject?.name}/>
				</Grid>
				<Grid item>
					<FormControlLabel
						label='Nähtav'
						control={<Switch name='active' defaultChecked={defaultSubject?.active || false} />} />
				</Grid>
				<Grid item container direction='row'>
					<Grid item container xs={6} justifyContent='center'>
						<Button className='button-back' variant='contained' component={Link} to='/admin/specialities'>Tagasi</Button>
					</Grid>
					<Grid item container xs={6} justifyContent='center'>
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
