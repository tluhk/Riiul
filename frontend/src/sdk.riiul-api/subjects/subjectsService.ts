import {get, post, put} from '../common/request'
import Subject from './models/Subject'
import SubjectResponse from './types/SubjectResponse'
import updateSubjectForm from './types/SubjectUpdateForm'
import SubjectNewForm from './types/SubjectNewForm'

async function getAll(auth = false): Promise<Subject[]> {
	const res = await get<SubjectResponse[]>('/subjects', auth)

	return res.body.map(subject => Subject.fromResponse(subject))
}

async function update(id: number, subject: updateSubjectForm): Promise<void> {
	await put(`/subjects/${id}`, subject, true)
}

async function add(subject: SubjectNewForm): Promise<void> {
	await post('/subjects', subject, true)
}

export default {
	getAll,
	update,
	add
}
