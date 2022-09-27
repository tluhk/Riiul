import SubjectFormsControlsCollections from '../types/SubjectFormsControlsCollection'
import SubjectNewForm from '../../../sdk.riiul-api/subjects/types/SubjectNewForm'

function htmlFormToSubjectNewForm(elements: SubjectFormsControlsCollections): SubjectNewForm {
	const { name, active} = elements

	return {
		name: name.value,
		active: active.checked
	}
}

export default htmlFormToSubjectNewForm
