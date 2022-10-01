/* eslint-disable @typescript-eslint/no-explicit-any */

import tokenService from './tokenService'
import ApiServiceError from './errors/ApiServiceError'
import {Config, ConfigKeys} from '@riiul/frontend.shared'

type ApiResponse<T> = {
	response: Response,
	body: T
}

async function request<T>(method: string, path: string, auth: boolean, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
	const url = `${Config.get(ConfigKeys.API_URL)}${path}`
	const options: any = {
		headers: {
			'Content-Type': 'application/json'
		},
		method
	}

	if (body) options.body = JSON.stringify(body)

	if (auth)
		options.headers.Authorization = window.sessionStorage.getItem('TOKEN')

	let response
	try {
		response = await fetch(url, options)
	} catch (err) {
		throw new ApiServiceError((err as Error).message)
	}
	if (!response.status.toString().match(/2../))
		throw new ApiServiceError((await response.json()).message, response.status)

	let responseBody
	const contentType = response.headers.get('content-type')
	if (contentType && contentType.indexOf('application/json') !== -1)
		responseBody = await response.json()

	const token = response.headers.get('authorization')
	if (auth && token) tokenService.setToken(token)

	return {
		response,
		body: responseBody
	}
}

export async function get<T>(path: string, auth = false): Promise<ApiResponse<T>> {
	return await request<T>('GET', path, auth)
}

export async function put<T = void>(path: string, body: Record<string, unknown>, auth = true): Promise<ApiResponse<T>> {
	return await request<T>('PUT', path, auth, body)
}

export async function post<T = void>(path: string, body: Record<string, unknown>, auth = true): Promise<ApiResponse<T>> {
	return await request<T>('POST', path, auth, body)
}

export async function del<T = void>(path: string, auth = true): Promise<ApiResponse<T>> {
	return await request<T>('DELETE', path, auth)
}

export default request
