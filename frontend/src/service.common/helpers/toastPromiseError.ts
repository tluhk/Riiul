import {UpdateOptions} from 'react-toastify'
import ApiServiceError from '../../sdk.riiul-api/common/errors/ApiServiceError'

const toastPromiseError: UpdateOptions = {
	render({data}: {data: ApiServiceError}) {
		return data.message
	}
}

export default toastPromiseError
