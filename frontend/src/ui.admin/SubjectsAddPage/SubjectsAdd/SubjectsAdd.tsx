import './SubjectsAdd.scss'

import React from 'react'
import {Link} from 'react-router-dom'
import Button from '@mui/material/Button'
import {FormControlLabel, Grid, Switch, TextField} from '@mui/material'
import useSubject from '../../../service.admin/subject/useSubject'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import {LoadingButton} from '@mui/lab'

const SubjectsAdd = React.memo(() => {
	const { subject, isLoading, save, isSaving } = useSubject()

	if (isLoading) return <LoadingIndicator />

	return (
		<form onSubmit={save} >
			<Grid container direction='column' alignItems='center' spacing={8} className='specialities-add-page'>
				<Grid item>
					<TextField
						label='Nimi'
						fullWidth
						name='name'
						defaultValue={subject?.name}/>
				</Grid>
				<Grid item>
					<FormControlLabel
						label='Nähtav'
						control={<Switch name='active' defaultChecked={subject?.active || false} />} />
				</Grid>
				<Grid item container direction='row'>
					<Grid item container xs={6} justifyContent='center'>
						<Button className='button-back' variant='contained' component={Link} to='/admin/specialities' color='secondary'>Tagasi</Button>
					</Grid>
					<Grid item container xs={6} justifyContent='center'>
						<LoadingButton
							type='submit'
							disabled={isSaving}
							loading={isSaving}
							loadingPosition='start'
							className='button-submit'
							variant='contained'
							color='secondary'>Salvesta</LoadingButton>
					</Grid>
				</Grid>
			</Grid>
		</form>
	)
})

export default SubjectsAdd
