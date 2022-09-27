import WorkExternalLink from './WorkExternalLink'
import WORK_EXTERNAL_LINK from '../enums/WORK_EXTERNAL_LINK'
import WorkMedia from './WorkMedia'
import WorkFile from './WorkFile'
import {WorkResponse} from '../types/WorkResponse'

export type WorkNonFormData = {
	graduationYear: number | null
	tags: string[]
	authors: string[]
	files: WorkFile[]
	images: WorkFile[]
}

class Work {

	constructor(
		readonly id: number,
		readonly title: string,
		readonly subjectId: number,
		readonly description: string,
		readonly priority: boolean,
		readonly isVideoPreviewImage: boolean,
		readonly active: boolean | null = null,
		readonly graduationYear: number | null = null,
		readonly externalLinks: WorkExternalLink[] = [],
		readonly authors: string[] = [],
		readonly tags: string[] = [],
		readonly images: WorkFile[] = [],
		readonly files: WorkFile[] = []
	) {}

	static fromWorkResponse(work: WorkResponse): Work {
		return new Work(
			work.id,
			work.title,
			work.subjectId,
			work.description,
			work.priority,
			work.isVideoPreviewImage,
			work.active,
			work.graduationYear,
			work.externalLinks.map(link =>
				WorkExternalLink.fromWorkResponseExternalLink(link)),
			work.authors,
			work.tags,
			work.images.map((image) =>
				WorkFile.fromWorkResponseFile(image)),
			work.files.map((file) =>
				WorkFile.fromWorkResponseFile(file))
		)
	}

	get titleWithGraduation(): string {
		return `${this.title} ${this.isDissertation ? `(${this.graduationYear} aasta lõputöö)` : ''}`
	}

	get attachments(): (WorkFile | WorkExternalLink)[] {
		return [this.files, this.externalLink || []].flat()
	}

	get hasAttachments(): boolean {
		return this.files.length > 0
	}

	get isDissertation(): boolean {
		return !!this.graduationYear
	}

	get media(): WorkMedia[] {
		const media = []

		for (const image of this.images) {
			media.push(WorkMedia.image(image.name))
		}

		const youtubeLink = this.youtubeExternalLink?.link

		if (!youtubeLink) return media

		if (this.isVideoPreviewImage) {
			media.unshift(WorkMedia.youtube(youtubeLink))
		} else {
			media.push(WorkMedia.youtube(youtubeLink))
		}

		return media
	}

	get youtubeExternalLink(): WorkExternalLink | undefined {
		return this.externalLinks.find(link => link.type === WORK_EXTERNAL_LINK.YOUTUBE)
	}

	get externalLink(): WorkExternalLink | undefined {
		return this.externalLinks.find(link => link.type === WORK_EXTERNAL_LINK.EXTERNAL)
	}
}

export default Work
