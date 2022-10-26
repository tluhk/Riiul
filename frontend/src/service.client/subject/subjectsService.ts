import {ApiResponse, get} from '@riiul/sdk.riiul-api'
import {SubjectsClientResponse} from './models'

export async function getClientSubjects(): Promise<ApiResponse<SubjectsClientResponse[]>> {
  const res = await get<{ data: SubjectsClientResponse[], errors: string[] }>('/subjects', false)

  return new ApiResponse(res.body)
}
