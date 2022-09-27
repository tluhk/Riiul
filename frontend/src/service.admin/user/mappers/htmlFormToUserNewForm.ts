import UserFormsControlsCollection from '../types/UserFormsControlsCollection'
import UserNewForm from '../../../sdk.riiul-api/users/types/UserNewForm'

function htmlFormToUserNewForm(elements: UserFormsControlsCollection): UserNewForm {
	const { name, email, password, passwordConfirmation} = elements

	if (password.value !== passwordConfirmation.value) throw new Error('PASSWORDS_DO_NOT_MATCH')

	return {
		name: name.value,
		email: email.value,
		password: password.value
	}
}

export default htmlFormToUserNewForm
