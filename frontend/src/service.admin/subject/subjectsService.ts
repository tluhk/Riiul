import {ApiResponse, get, post, put} from '@riiul/sdk.riiul-api'
import {
  SubjectAdmin,
  SubjectPostBody, SubjectsAdminResponse
} from './models'

export async function findSubject(id: number): Promise<ApiResponse<SubjectAdmin>> {
  const res = await get<{ data: SubjectAdmin, errors: string[] }>(`/admin/subjects/${id}`, true)

  return new ApiResponse(res.body)
}

export async function getAdminSubject(): Promise<SubjectsAdminResponse> {
  const res = await get<{ data: SubjectAdmin[], errors: string[] }>('/admin/subjects', true)

  return new SubjectsAdminResponse(res.body)
}

export async function updateSubject(id: number, subject: Partial<SubjectPostBody>): Promise<void> {
  await put(`/admin/subjects/${id}`, subject, true)
}

export async function addSubject(subject: SubjectPostBody): Promise<void> {
  await post('/admin/subjects', subject, true)
}
