import HttpError from './HttpError'

class HttpErrorInternalServerError extends HttpError {
	constructor(e: Error) {
		super(500, 'INTERNAL_SERVER_ERROR', e)
	}
}

export default HttpErrorInternalServerError
