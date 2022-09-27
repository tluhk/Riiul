import WorkShortResponse from '../types/WorkShortResponse'

class WorkShort {
	readonly id: number
	readonly title: string
	readonly subjectId: number
	readonly image: string
	readonly active: boolean | null

	constructor(
		id: number,
		title: string,
		subjectId: number,
		image: string,
		active: boolean | null = null
	) {
		this.id = id
		this.title = title
		this.subjectId = subjectId
		this.active = active
		this.image = image
	}

	static fromWorkResponse(work: WorkShortResponse): WorkShort {
		return new WorkShort(
			work.id,
			work.title,
			work.subjectId,
			work.image,
			work.active
		)
	}

	get editLink(): string {
		return `/admin/works/edit/${this.title}`
	}

	get viewLink(): string {
		return `/works/${this.title}`
	}

	get imageSrc(): string {
		if (this.image.includes('http')) return  this.image

		return `${process.env.REACT_APP_API_URL}/files/${this.image}`
	}
}

export default WorkShort
