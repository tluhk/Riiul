import SubjectsListResponse from '../types/SubjectsListResponse'
import SubjectUpdateBody from '../types/SubjectUpdateBody'
import SubjectPostBody from '../types/SubjectsPostBody'
import {subjectsRepository, Subject, User} from "@riiul/repository"

export async function getSubjects(user?: User): Promise<SubjectsListResponse> {
	let subjects: Subject[]

	if (user) {
		subjects = await subjectsRepository.getSubjects()
	} else {
		subjects = await subjectsRepository.getPublicSubjects()
	}

	return subjects.map(s => ({
		id: s.id,
		name: s.name,
		active: s.active
	}))
}

export async function updateSubject(id: number, subject: SubjectUpdateBody): Promise<void> {
	await subjectsRepository.updateSubject(id, subject)

}

export async function addSubject(subject: SubjectPostBody): Promise<void> {
	await subjectsRepository.saveSubject(subject)
}
