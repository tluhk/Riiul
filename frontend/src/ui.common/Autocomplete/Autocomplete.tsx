import {TextField, Autocomplete as MaterialAutocomplete} from '@mui/material'
import React from 'react'

export type AutocompleteProps = {
	items: string[]
	defaultValue?: string[]
	label: string
	onChange: (value: string[]) => void
}

const Autocomplete = React.memo<AutocompleteProps>((props) => {
	const {items, defaultValue, label, onChange} = props

	return (
		<MaterialAutocomplete
			multiple
			freeSolo
			value={defaultValue}
			options={items}
			onChange={(_, value) => onChange(value as string[])}
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					placeholder={label}
				/>
			)}
		/>
	)

})

export default Autocomplete
