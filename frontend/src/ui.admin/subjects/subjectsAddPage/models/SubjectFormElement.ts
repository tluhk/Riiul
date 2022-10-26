import {SubjectFormsControlsCollections} from './SubjectFormsControlsCollection'

export interface SubjectFormElement extends HTMLFormElement {
	readonly elements: SubjectFormsControlsCollections
}

