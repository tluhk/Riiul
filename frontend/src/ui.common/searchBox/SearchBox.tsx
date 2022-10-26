import './SearchBox.scss'

import React, {useEffect, useState} from 'react'
import {Autocomplete, Button, Grid, TextField} from '@mui/material'
import {getWorkQueryProps} from '../../service.common/works/getWorkQueryProps'
import {workQueryPropsToString} from '../../sdk.riiul-api/works/helpers/workQueryPropsToString'
import authorService from '../../sdk.riiul-api/authors/authorService'
import tagsService from '../../sdk.riiul-api/tags/tagsService'
import {SubjectsClientResponse} from '@riiul/service.client/subject'

export interface SearchBoxProps {
	subjects: SubjectsClientResponse[]
}

export const SearchBox = React.memo<SearchBoxProps>(props => {
	const { subjects } = props

	const [authors, setAuthors] = useState<string[]>([])
	const [tags, setTags] = useState<string[]>([])

	const [searchAuthors, setSearchAuthors] = useState<string[]>([])
	const [searchTags, setSearchTags] = useState<string[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [searchSubjects, setSearchSubjects] = useState<string[]>([])

	useEffect(() => {
		const search = getWorkQueryProps()
		setSearchAuthors(search.authors || [])
		setSearchTags(search.tags || [])
		setSearchSubjects(search.subjects || [])
		setSearchQuery(search.q || '')

		authorService.getAll()
			.then(res => setAuthors(res))
			.catch(console.error)

		tagsService.getAll()
			.then(res => setTags(res))
			.catch(console.error)
	}, [])

	function submit() {
		const params = {
			q: searchQuery,
			authors: searchAuthors,
			tags: searchTags,
			subjects: searchSubjects
		}

		window.location.href = `${window.location.origin + window.location.pathname}?${workQueryPropsToString(params)}`
	}

	return (
		<Grid item container xs={12} sm={4} direction='column' className='search-box'>
			<TextField
				className='child'
				label='Otsi nime järgi...'
				variant='standard'
				value={searchQuery}
				onChange={({target}) => setSearchQuery(target.value)} />
			<Autocomplete
				className='child'
				multiple
				freeSolo
				options={subjects.map(x => x.name)}
				onChange={(_, value) => setSearchSubjects(value as string[])}
				value={searchSubjects}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						label='Erialad'
					/>
				)}
			/>
			<Autocomplete
				className='child'
				multiple
				freeSolo
				options={tags}
				onChange={(_, value) => setSearchTags(value as string[])}
				value={searchTags}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						label='Otsingusõnad'
						placeholder='Otsingusõnad'
					/>
				)}
			/>
			<Autocomplete
				className='child'
				multiple
				freeSolo
				options={authors}
				onChange={(_, value) => setSearchAuthors(value as string[])}
				value={searchAuthors}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						label='Autorid'
						placeholder='Autorid'
					/>
				)}
			/>
			<Button className='submit' variant='contained' color='primary' onClick={submit}>Otsi</Button>
		</Grid>
	)
})
