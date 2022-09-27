import React from 'react'
import {Grid, TextField} from '@mui/material'
import OutlinedContainer from '../../../../ui.common/OutlinedContainer/OutlinedContainer'

type ExternalLinkProps = {
	namePrefix: string
	defaultName?: string
	defaultUrl?: string
	hideName?: boolean
	label: string
}

const ExternalLink = React.memo<ExternalLinkProps>((props) => {
	const { namePrefix, defaultName, defaultUrl, hideName, label } = props

	return (
		<Grid item xs={12} sm={6}>
			<OutlinedContainer label={label}>
				<TextField
					label="Nimi"
					name={`${namePrefix}LinkName`}
					variant='standard'
					hidden={hideName}
					defaultValue={defaultName} />
				<TextField
					label="URL"
					name={`${namePrefix}Link`}
					variant='standard'
					defaultValue={defaultUrl} />
			</OutlinedContainer>
		</Grid>
	)

})

export default ExternalLink
