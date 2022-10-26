import {SubjectAdmin, SubjectUpdateBody} from '@riiul/service.admin'
import { SubjectFormsControlsCollections } from '../models/SubjectFormsControlsCollection'

export function htmlFormToSubjectUpdateForm(elements: SubjectFormsControlsCollections, oldSubject: SubjectAdmin): SubjectUpdateBody {
	const { name, active} = elements
	const form: SubjectUpdateBody = {}

	if (name.value !== oldSubject.name) {
		form.name = name.value
	}
	if (active.checked !== oldSubject.active) {
		form.active = active.checked
	}

	if (Object.keys(form).length === 0) throw new Error('Ühtegi välja pole uuendada')

	return form
}
