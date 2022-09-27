import SubjectFormsControlsCollections from './SubjectFormsControlsCollection'

interface SubjectFormElement extends HTMLFormElement {
	readonly elements: SubjectFormsControlsCollections
}

export default SubjectFormElement
