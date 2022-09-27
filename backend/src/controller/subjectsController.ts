import asyncHandler from 'express-async-handler'
import express from 'express'
import SubjectsListResponse from '../types/SubjectsListResponse'
import {addSubject, getSubjects, updateSubject} from '../services/subjectsService'
import optionalAuthentication from '../middleware/optionalAuthentication'
import validateAuthentication from '../middleware/validateAuthentication'
import SubjectPostBody from '../types/SubjectsPostBody'
import SubjectUpdateBody from '../types/SubjectUpdateBody'

const router = express.Router()

router.get<unknown, SubjectsListResponse>('/', optionalAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send(await getSubjects(res.locals.user))
}))

router.post<unknown, never, SubjectPostBody>('/', validateAuthentication, asyncHandler(async (req, res) => {
	await addSubject(req.body)
	res.status(200).send()
}))

router.put<{id: number}, never, SubjectUpdateBody>('/:id([0-9]+)', validateAuthentication, asyncHandler(async (req, res) => {
	await updateSubject(req.params.id, req.body)
	res.status(200).send()
}))

export default router
