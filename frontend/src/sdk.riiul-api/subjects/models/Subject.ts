import SubjectResponse from '../types/SubjectResponse'

class Subject {
	id: number
	name: string
	active: boolean

	constructor(id: number, name: string, active: boolean) {
		this.id = id
		this.name = name
		this.active = active
	}

	static fromResponse(json: SubjectResponse): Subject {
		return new Subject(
			json.id,
			json.name,
			json.active
		)
	}

	toLabelValue(): { label: string, value: number } {
		return {
			label: this.name,
			value: this.id
		}
	}

	get searchLink(): string {
		return `/works?subjects=${this.name}`
	}
}

export default Subject
