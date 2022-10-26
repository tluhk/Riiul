import {subjectsRepository} from "@riiul/repository"
import {SubjectPostBody, SubjectsAdminResponse, SubjectsClientResponse, SubjectUpdateBody} from "./models";
import HttpErrorNotFound from "@riiul/errors/HttpErrorNotFound";

export async function findSubject(id: number): Promise<SubjectsAdminResponse> {
	const subject = await subjectsRepository.findSubjectWithId(id)

	return {
		id: subject.id,
		name: subject.name,
		active: subject.active
	}
}

export async function getSubjects(): Promise<SubjectsAdminResponse[]> {
	const subjects = await subjectsRepository.getSubjects()

	return subjects.map(subject => ({
		id: subject.id,
		name: subject.name,
		active: subject.active
	}))
}

export async function getPublicSubjects(): Promise<SubjectsClientResponse[]> {
	const subjects = await subjectsRepository.getPublicSubjects()

	return subjects.map(subject => ({
		id: subject.id,
		name: subject.name
	}))
}

export async function updateSubject(id: number, subject: SubjectUpdateBody): Promise<void> {
	const updatedSubject = await subjectsRepository.updateSubject(id, subject)

	if (updatedSubject === undefined) throw new HttpErrorNotFound()
}

export async function addSubject(subject: SubjectPostBody): Promise<void> {
	await subjectsRepository.saveSubject(subject)
}
