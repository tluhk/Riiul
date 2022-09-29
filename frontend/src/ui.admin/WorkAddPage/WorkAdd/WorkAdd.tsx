import './WorkAdd.scss'

import React, {FormEvent, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {TextField, FormControlLabel, Switch, Grid} from '@mui/material'
import Button from '@mui/material/Button'
import {DatePicker, LoadingButton} from '@mui/lab'
import {DateTime} from 'luxon'
import useWork from '../../../service.admin/work/useWork'
import Select from '../../../ui.common/Select/Select'
import Autocomplete from '../../../ui.common/Autocomplete/Autocomplete'
import Attachments from './components/Attachments/Attachments'
import LoadingIndicator from '../../../ui.common/LoadingIndicator/LoadingIndicator'
import OutlinedContainer from '../../../ui.common/OutlinedContainer/OutlinedContainer'
import WorkFile from '../../../sdk.riiul-api/works/models/WorkFile'
import useSubjects from '../../../service.common/subjects/useSubjects'
import useTags from '../../../service.common/tags/useTags'
import useAuthors from '../../../service.common/authors/useAuthors'
import WorkFormElement from '../../../service.admin/work/types/WorkFormElement'
import ExternalLink from './components/ExternalLink'

const WorkAddPage = React.memo(() => {
	const { work, isSaving, isLoading, save } = useWork()

	const { subjects } = useSubjects()
	const { tags } = useTags()
	const { authors } = useAuthors()

	const [workAuthors, setWorkAuthors] = useState<string[]>([])
	const [workTags, setWorkTags] = useState<string[]>([])
	const [files, setFiles] = useState<WorkFile[]>([])
	const [images, setImages] = useState<WorkFile[]>([])

	const [graduationYear, setGraduationYear] = useState<number | null>(null)
	const [dissertation, setDissertation] = useState<boolean>(false)

	useEffect(() => {
		if (!work) return

		setWorkAuthors(work.authors)
		setWorkTags(work.tags)
		setFiles(work.files)
		setImages(work.images)

		setDissertation(work.graduationYear !== null)
		setGraduationYear(work.graduationYear)

	}, [work])

	function onSubmit(e: FormEvent<WorkFormElement>) {
		e.preventDefault()

		save(e, {
			graduationYear: dissertation ? graduationYear : null,
			tags: workTags,
			authors: workAuthors,
			files,
			images
		})
	}

	if (isLoading) return <LoadingIndicator />

	return (
		<form onSubmit={onSubmit}>
			<Grid container spacing={3} justifyContent='center' className='add-work'>
				<Grid item container spacing={2} sm={6} direction='column'>
					<Grid item>
						<TextField
							label='Töö pealkiri'
							name='title'
							defaultValue={work?.title}/>
					</Grid>
					<Grid item>
						<Select items={subjects.map(x => x.toLabelValue())} defaultValue={work?.subjectId} label='Eriala' name='subject'/>
					</Grid>
					<Grid item container>
						<Grid item xs={12} sm={4}>
							<FormControlLabel
								label='Lõputöö'
								control={<Switch checked={dissertation} onChange={({target}) => setDissertation(target.checked)} />} />
						</Grid>
						<Grid item xs={12} sm={8}>
							<DatePicker
								disabled={!dissertation}
								views={['year']}
								label='Lõpetamise aasta'
								value={graduationYear ? DateTime.fromObject({year: graduationYear}) : null}
								onChange={(x) => {
									if (x) setGraduationYear(x.year)
								}}
								renderInput={(params) => <TextField  style={{width: '100%'}}{...params} />} />
						</Grid>
					</Grid>
				</Grid>
				<Grid item container spacing={2} sm={6} direction='column'>
					<Grid item>
						<Autocomplete items={authors || []} defaultValue={workAuthors} label='Autorid' onChange={setWorkAuthors} />
					</Grid>
					<Grid item>
						<Autocomplete items={tags || []} defaultValue={workTags} label='Otsingusõnad' onChange={setWorkTags} />
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Kirjeldus"
						name='description'
						defaultValue={work?.description}
						multiline
						minRows={3} />
				</Grid>
				<Grid item container xs={12} justifyContent='center'>
					<OutlinedContainer label='seaded'>
						<FormControlLabel
							label='Prioriteetne'
							control={<Switch name='priority' defaultChecked={work?.priority || false} />} />
						<FormControlLabel
							label='Aktiivne'
							control={<Switch name='active' defaultChecked={work?.active || false} />} />
						<FormControlLabel
							label='Video on eelvaade'
							control={<Switch name='isVideoPreviewImage' defaultChecked={work?.isVideoPreviewImage || false} />} />
					</OutlinedContainer>
				</Grid>
				<ExternalLink
					namePrefix='youtube'
					label='Youtube video'
					defaultName={work?.youtubeExternalLink?.title  || 'YOUTUBE'}
					defaultUrl={work?.youtubeExternalLink?.link}
					hideName />
				<ExternalLink
					namePrefix='external'
					label='Väline video'
					defaultName={work?.externalLink?.title}
					defaultUrl={work?.externalLink?.link} />
				<Attachments
					files={files}
					images={images}
					onFilesChange={setFiles}
					onImagesChange={setImages} />
				<Grid item container direction='row' className='function-block'>
					<Grid item container xs={6} justifyContent='center' >
						<Button className={'button-back'} variant='contained' component={Link} to='/admin/works' color='secondary'>Tagasi</Button>
					</Grid>
					<Grid item container xs={6} justifyContent='center' >
						<LoadingButton
							type='submit'
							disabled={isSaving}
							loading={isSaving}
							loadingPosition='start'
							className={'button-submit'}
							variant='contained'
							color='secondary'>Salvesta</LoadingButton>
					</Grid>
				</Grid>
			</Grid>
		</form>

	)
})

export default WorkAddPage
