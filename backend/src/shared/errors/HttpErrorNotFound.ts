import HttpError from './HttpError'

class HttpErrorNotFound extends HttpError {
	constructor(message: string = "NOT_FOUND", originalError?: Error) {
		super(404, message, originalError)
	}
}

export default HttpErrorNotFound
