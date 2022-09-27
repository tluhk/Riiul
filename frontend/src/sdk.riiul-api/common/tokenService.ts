const TOKEN_KEY = 'TOKEN'

function getToken(): string | null {
	return sessionStorage.getItem(TOKEN_KEY)
}

function setToken(token: string): void {
	sessionStorage.setItem(TOKEN_KEY, token)
}

function clearToken(): void {
	sessionStorage.removeItem(TOKEN_KEY)
}

export default {
	getToken,
	setToken,
	clearToken
}
