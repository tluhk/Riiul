import SubjectFormsControlsCollections from './UserFormsControlsCollection'

interface UserFormElement extends HTMLFormElement {
	readonly elements: SubjectFormsControlsCollections
}

export default UserFormElement
