import {makeRequest, RequestConfig} from './makeRequest'

export * from './makeRequest'
export type {AxiosError} from 'axios'

export interface ApiResponse<T> {
  data: T
  errors: string[]
}

export async function makeGetRequest<T>(url: string, config?: RequestConfig): Promise<T> {
  return makeRequest<T>('get', url, config)
}

export async function makePostRequest<T>(url: string, config?: RequestConfig): Promise<T> {
  return makeRequest<T>('post', url, config)
}

export async function makePutRequest<T>(url: string, config?: RequestConfig): Promise<T> {
  return makeRequest<T>('put', url, config)
}

export async function makeDeleteRequest<T>(url: string, config?: RequestConfig): Promise<T> {
  return makeRequest<T>('delete', url, config)
}
