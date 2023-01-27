import React from 'react'
import {SubjectAdmin} from '@riiul/service.admin'
import {TableCell, TableRow} from '@riiul/ui.common/table'
import {VisibilityOff, Visibility, MoreVertOutlined} from '@mui/icons-material'
import {IconButton} from '@mui/material'

export interface SubjectsListColumnProps {
	subject: SubjectAdmin
	onClick: (target: Element, id: number) => void
}

export const SubjectsListColumn = React.memo<SubjectsListColumnProps>(props => {
	const { subject, onClick } = props

	const icon = subject.active ? <Visibility /> : <VisibilityOff />

	return (
		<TableRow>
			<TableCell>{subject.name}</TableCell>
			<TableCell align='center'>{icon}</TableCell>
			<TableCell align='center'>
				<IconButton onClick={value => onClick(value.currentTarget, subject.id)}>
					<MoreVertOutlined/>
				</IconButton>
			</TableCell>
		</TableRow>
	)
})
