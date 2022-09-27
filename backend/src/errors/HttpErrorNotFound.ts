import HttpError from './HttpError'

class HttpErrorNotFound extends HttpError {
	constructor(message: string, originalError?: Error) {
		super(404, message, originalError)
	}
}

export default HttpErrorNotFound
