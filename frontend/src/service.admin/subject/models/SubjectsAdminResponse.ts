import {ApiResponse} from '@riiul/sdk.riiul-api'
import {SubjectAdmin} from '@riiul/service.admin'

export interface SubjectLabel {
  label: string
  value: number
}

export class SubjectsAdminResponse extends ApiResponse<SubjectAdmin[]> {
  get getLabels(): SubjectLabel[] {
    return this.data.map(subject => ({
      label: subject.name,
      value: subject.id
    }))
  }
}
