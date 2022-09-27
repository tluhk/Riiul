class WorkMedia {
	static IMAGE = 'IMAGE'
	static YOUTUBE = 'YOUTUBE'

	readonly type: string
	readonly link: string

	constructor(type: string, link: string) {
		this.type = type

		if (type === WorkMedia.YOUTUBE) {
			const [, videoId] = link.match('v=(.*?)($|&)') || []
			if (!videoId) throw new Error('Invalid youtube link')

			this.link = videoId
		} else if (type === WorkMedia.IMAGE) {
			this.link = link
		} else {
			throw new Error('Invalid media type')
		}
	}

	static youtube(link: string): WorkMedia {
		return new WorkMedia(WorkMedia.YOUTUBE, link)
	}

	static image(link: string): WorkMedia {
		return new WorkMedia(WorkMedia.IMAGE, link)
	}

	get isYoutube(): boolean {
		return this.type === WorkMedia.YOUTUBE
	}

	get isImage(): boolean {
		return this.type === WorkMedia.IMAGE
	}

	get src(): string {
		if (this.type === WorkMedia.YOUTUBE) {
			return `https://www.youtube.com/embed/${this.link}`
		}

		return `${process.env.REACT_APP_API_URL}/files/${this.link}`
	}

	get snapshotSrc(): string {
		if (this.type === WorkMedia.IMAGE) {
			return this.src
		} else if (this.type === WorkMedia.YOUTUBE) {
			return (`https://img.youtube.com/vi/${this.link}/0.jpg`)
		}

		throw new Error(`Unknown media type "${this.type}"`)
	}
}

export default WorkMedia
