import SubjectFormsControlsCollections from '../types/SubjectFormsControlsCollection'
import SubjectUpdateForm from '../../../sdk.riiul-api/subjects/types/SubjectUpdateForm'
import Subject from '../../../sdk.riiul-api/subjects/models/Subject'

function htmlFormToSubjectUpdateForm(elements: SubjectFormsControlsCollections, oldSubject: Subject): SubjectUpdateForm {
	const { name, active} = elements
	const form: SubjectUpdateForm = {}

	if (name.value !== oldSubject.name) {
		form.name = name.value
	}
	if (active.checked !== oldSubject.active) {
		form.active = active.checked
	}

	if (Object.keys(form).length === 0) throw new Error('Ühtegi välja pole uuendada')

	return form
}

export default htmlFormToSubjectUpdateForm
