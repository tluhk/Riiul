import {UpdateOptions} from 'react-toastify'
import ApiServiceError from '../../sdk.riiul-api/common/errors/ApiServiceError'

const toastPromiseError: UpdateOptions = {
	render(data) {
		return (data.data as ApiServiceError).message
	}
}

export default toastPromiseError
