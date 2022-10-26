class HttpError extends Error {
	status: number
	originalError?: Error

	constructor(statusCode: number, message: string, originalError?: Error) {
		super(message)

		this.originalError = originalError
		this.status = statusCode
	}

	getJson(): { status: number; message: string } {
		return {
			status: this.status,
			message: this.message
		}
	}
}

export default HttpError
