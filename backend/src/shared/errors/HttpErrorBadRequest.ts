import HttpError from './HttpError'

class HttpErrorBadRequest extends HttpError {
	constructor(message: string, originalError?: Error) {
		super(400, message, originalError)
	}
}

export default HttpErrorBadRequest
