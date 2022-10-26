import { SubjectPostBody } from '@riiul/service.admin'
import { SubjectFormsControlsCollections} from '../models/SubjectFormsControlsCollection'

export function htmlFormToSubjectNewForm(elements: SubjectFormsControlsCollections): SubjectPostBody {
	const { name, active} = elements

	return {
		name: name.value,
		active: active.checked
	}
}

