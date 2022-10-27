import asyncHandler from 'express-async-handler'
import express from 'express'
import {addSubject, findSubject, getSubjects, updateSubject} from './subjectsService'
import validateAuthentication from '../middleware/validateAuthentication'
import {SubjectsAdminResponse,SubjectPostBody, SubjectUpdateBody} from "./models"
import {ResponseHolder} from "@riiul/models"

const router = express.Router()

router.get<{id: number}, ResponseHolder<SubjectsAdminResponse>, SubjectUpdateBody>('/:id([0-9]+)', validateAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send({
		data: await findSubject(req.params.id),
		errors: []
	})
}))

router.get<unknown, ResponseHolder<SubjectsAdminResponse[]>>('/', validateAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send({
		data: await getSubjects(),
		errors: []
	})
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
