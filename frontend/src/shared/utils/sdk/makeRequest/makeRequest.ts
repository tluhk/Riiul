/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {AxiosInstance, AxiosInterceptorManager, AxiosResponse, Method} from 'axios'

export interface RequestConfig {
  params?: Record<string, any>,
  query?: Record<string, any>,
  body?: Record<string, any> | FormData
}

export const API: AxiosInstance = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export async function makeRequest<T>(method: Method, url: string, config: RequestConfig = {}): Promise<T> {
  const { params, query, body } = config

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      url = url.replace(`{${key}}`, params[key])
    }
  }

  const res = await API.request({
    method,
    url,
    params: query,
    data: body,
    withCredentials: true
  })

  return res.data
}

export const interceptResponse: AxiosInterceptorManager<AxiosResponse>['use'] = (onFulfilled, onRejected) =>
  API.interceptors.response.use(onFulfilled, onRejected)
