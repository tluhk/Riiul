import './Dropzone.scss'

import {Button, Grid, IconButton, Table, TableBody, TableCell, TableRow} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import React, {useMemo} from 'react'
import {ErrorCode, FileError, useDropzone} from 'react-dropzone'
import {ArrowDropDown, ArrowDropUp, Clear} from '@mui/icons-material'
import WorkFile from '../../sdk.riiul-api/works/models/WorkFile'

type DropzoneProps = {
	accept: string
	max: number
	files: WorkFile[]
	onUpdate: (files:  WorkFile[]) => void
}

const TOO_MANY_FILES_ERROR = 'Liiga palju faile'

const Dropzone = React.memo<DropzoneProps>(({ files , onUpdate, max, accept}) => {
	const IS_EMPTY = useMemo(() => files.length === 0, [files])

	const {getRootProps, getInputProps, isDragAccept, isDragReject, inputRef} = useDropzone({
		maxFiles: max,
		noClick: !IS_EMPTY,
		accept,
		onDrop: (addFiles) => {
			const newFiles = [...files, ...(addFiles.map(file => WorkFile.fromFile(file)))]

			if(newFiles.length > max) return alert(TOO_MANY_FILES_ERROR)

			onUpdate(newFiles)
		},
		validator: (file) => {
			const errors: FileError[] = []

			if(file.type !== accept) errors.push({message: 'Vale faili tüüp', code: ErrorCode.FileInvalidType})

			return errors.length ? errors : null
		},
		onDropRejected: (rejectedFiles) => {
			rejectedFiles.forEach(({file, errors}) => errors.forEach(({message}) => alert(`${file.name} ${message}`)))
		},
	})

	function swap(a: number, b: number) {
		const tempFiles = [...files]

		const z = tempFiles[a]
		tempFiles[a] = tempFiles[b]
		tempFiles[b] = z

		onUpdate(tempFiles)
	}

	function remove(index: number) {
		const tempFiles = [...files]

		tempFiles.splice(index, 1)
		onUpdate(tempFiles)
	}

	function addFiles() {
		inputRef.current?.click()
	}

	const fileList =
		<Table>
			<TableBody>
				{files.map((file, i) => (
					<TableRow key={file.name}>
						{/image\/.*/.test(accept) && <TableCell>
							<img src={file.src} alt={file.name}/>
						</TableCell>}
						<TableCell>{file.name}</TableCell>
						<TableCell>
							<IconButton disabled={i === 0} onClick={() => swap(i, --i)}><ArrowDropUp /></IconButton>
							<IconButton disabled={i === files.length - 1} onClick={() => swap(i, ++i)}><ArrowDropDown /></IconButton>
						</TableCell>
						<TableCell onClick={() => remove(i)}>
							<IconButton><Clear /></IconButton>
						</TableCell>
					</TableRow>
				))}
				{files.length < max && <TableRow>
					<TableCell colSpan={4}>
						<Button className='add-file-button' onClick={addFiles}>Lisa fail</Button>
					</TableCell>
				</TableRow>}
			</TableBody>
		</Table>

	const empty =
		<Grid container direction='column' justifyContent='center' alignItems='center'>
			<Grid item>
				<p>Lohistage mõned failid siia või klõpsake failide valimiseks</p>
			</Grid>
			<Grid item>
				<CloudUploadIcon fontSize='large' />
			</Grid>
		</Grid>

	return (
		<div>
			<input name='files' {...getInputProps()} accept={accept}/>
			<div className={`dropzone ${isDragAccept ? 'dropzone-drop-accept' : (isDragReject ? 'dropzone-drop-reject' : '')}`} {...getRootProps()}>
				{IS_EMPTY ? empty : fileList}
			</div>
		</div>
	)

})

export default Dropzone
