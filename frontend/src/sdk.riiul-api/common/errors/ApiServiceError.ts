import tokenService from '../tokenService'
import fieldNames from './fieldNames'

class ApiServiceError extends Error {
	status?: number

	constructor(message: string, status?: number) {
		super(message)
		this.status = status

		switch (status) {
		case 400:
			this.message = this.getBadRequestMessage()
			break
		case 401:
			tokenService.clearToken()

			this.message = 'Teie sessioon on aegunud, palun logige uuesti sisse'
			break
		case 404:
			this.message = 'Kahjuks ei leitud'
			break
		default:
			this.message = 'Vabandame, tekkis tehniline viga. Proovige hiljem uuesti'
			break
		}
	}

	private getBadRequestMessage(): string {
		switch (this.message) {
		case 'INVALID_JSON_BODY':
			return 'Vigane JSON päringu keha'
		case 'INVALID_EMAIL_OR_PASSWORD':
			return 'Vigane e-posti aadress või parool'
		default:
			if (this.message.includes('_IS_REQUIRED')) {
				const fieldKey = this.message.replace('_IS_REQUIRED', '')
				const fieldName = fieldNames[fieldKey]

				return fieldName ? `${fieldName} on kohustuslik` : 'Vigane päring'
			} else if (this.message.includes('_ALREADY_EXISTS')) {
				const fieldKey = this.message.replace('_ALREADY_EXISTS', '')
				const fieldName = fieldNames[fieldKey]

				return fieldName ? `${fieldName} on juba olemas` : 'Vigane päring'
			} else {
				return 'Vigane päring'
			}
		}
	}
}

export default ApiServiceError
