import WorkFormsControlsCollections from './WorkFormsControlsCollections'

interface WorkFormElement extends HTMLFormElement {
	readonly elements: WorkFormsControlsCollections
}

export default WorkFormElement
