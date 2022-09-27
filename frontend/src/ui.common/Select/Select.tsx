import React from 'react'
import {FormControl, InputLabel, MenuItem, Select as MaterialSelect} from '@mui/material'

export type SelectDataItem = {
  value: string | number,
  label: string | number,
}

export type SelectProps = {
	items: SelectDataItem[]
	defaultValue: unknown | null
	label: string
	name: string
}

const Select = React.memo<SelectProps>((props) => {
	const {items, defaultValue, label, name} = props

	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<MaterialSelect
				style={{textAlign: 'left'}}
				defaultValue={defaultValue || ''}
				name={name}>
				{items.map(item =>
					<MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
				)}
			</MaterialSelect>
		</FormControl>
	)
})

export default Select
