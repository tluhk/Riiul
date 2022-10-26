import UserFormsControlsCollection from '../types/UserFormsControlsCollection'
import User from '../../../sdk.riiul-api/users/models/User'
import UserUpdateForm from '../../../sdk.riiul-api/users/types/UserUpdateForm'
import UserNewForm from '@riiul/sdk.riiul-api/users/types/UserNewForm'

function htmlFormToUserUpdateForm(elements: UserFormsControlsCollection, oldUser: User): Partial<UserNewForm> {
	const { name, email, password, passwordConfirmation} = elements
	const form: UserUpdateForm = {}

	if (name.value !== oldUser.name) {
		form.name = name.value
	}
	if (email.value !== oldUser.email) {
		form.email = email.value
	}
	if (password.value) {
		if (password.value !== passwordConfirmation.value) throw new Error('PASSWORDS_DO_NOT_MATCH')
		form.password = password.value
	}

	if (Object.keys(form).length === 0) throw new Error('NO_FIELDS_TO_UPDATE')

	return form
}

export default htmlFormToUserUpdateForm
