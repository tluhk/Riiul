import {WorkResponseFile} from '../types/WorkResponse'

class WorkFile {
	readonly id: number
	readonly name: string
	private readonly _file?: File

	constructor(id: number, name: string, file?: File) {
		this.id = id
		this.name = name
		this._file = file
	}

	static fromWorkResponseFile(file: WorkResponseFile): WorkFile {
		return new WorkFile(file.id, file.name)
	}

	static fromFile(file: File): WorkFile {
		return new WorkFile(0, file.name, file)
	}

	async fileContent(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if (!this._file) return reject('FILE_NOT_AVAILABLE')

			const fr = new FileReader()
			fr.onload = () => {
				if (fr.result === null) return reject('FILE IS EMPTY')

				return resolve(fr.result.toString().split(',')[1])
			}
			fr.onerror = reject

			fr.readAsDataURL(this._file)
		})
	}

	get src(): string {
		if (this._file) return URL.createObjectURL(this._file)
		return `${process.env.REACT_APP_API_URL}/files/${this.name}`
	}
}

export default WorkFile
