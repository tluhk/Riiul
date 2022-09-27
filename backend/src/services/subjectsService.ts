import SubjectsListResponse from '../types/SubjectsListResponse'
import User from '../types/User'
import Subject from '../types/Subject'
import subjectDatabaseService from '../database/services/subjectDatabaseService'
import SubjectUpdateBody from '../types/SubjectUpdateBody'
import SubjectPostBody from '../types/SubjectsPostBody'

export async function getSubjects(user?: User): Promise<SubjectsListResponse> {
	let subjects: Subject[]

	if (user) {
		subjects = await subjectDatabaseService.allSubjects()
	} else {
		subjects = await subjectDatabaseService.allSubjectsPublic()
	}

	return subjects.map(s => ({
		id: s.id,
		name: s.name,
		active: s.active
	}))
}

export async function updateSubject(id: number, subject: SubjectUpdateBody): Promise<void> {
	await subjectDatabaseService.updateSubject(id, subject)

}

export async function addSubject(subject: SubjectPostBody): Promise<void> {
	await subjectDatabaseService.saveSubject(subject)
}
