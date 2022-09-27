import {post} from '../common/request'
import {toast} from 'react-toastify'
import toastPromiseError from '../../service.common/helpers/toastPromiseError'

async function logIn(email: string, password: string): Promise<void> {
	await toast.promise(post('/authenticate/login', {email, password}),
		{
			pending: 'Sisse logimine...',
			success: 'Sisse logitud!',
			error: toastPromiseError
		})
}

export default {
	logIn
}
