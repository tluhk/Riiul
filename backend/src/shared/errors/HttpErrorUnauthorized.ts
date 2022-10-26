import HttpError from './HttpError'

class HttpErrorUnauthorized extends HttpError {
	constructor(message: string, originalError?: Error) {
		super(401, message, originalError)
	}
}

export default HttpErrorUnauthorized
