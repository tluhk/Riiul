import asyncHandler from 'express-async-handler'
import express from 'express'
import {
	addWork,
	deleteWork,
	findWork,
	getWorks,
	updateWork
} from '../services/worksService'
import WorkListResponse from '../types/WorkListResponse'
import optionalAuthentication from '../middleware/optionalAuthentication'
import validateAuthentication from '../middleware/validateAuthentication'
import WorkPostBody from '../types/WorkPostBody'
import WorkUpdateBody from '../types/WorkUpdateBody'
import WorkListQuery from '../types/WorkListQuery'
import WorkResponse from '../types/WorkResponse'

const router = express.Router()

router.get<{name: string}, WorkResponse>('/:name', optionalAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send(await findWork(req.params.name, res.locals.user))
}))

router.get<never, WorkListResponse[], never, WorkListQuery, never>('/', optionalAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send(await getWorks(res.locals.user, req.query))
}))

router.delete<{id: number}, never>('/:id([0-9]+)', validateAuthentication, asyncHandler(async (req, res) => {
	await deleteWork(req.params.id)
	res.status(200).send()
}))

router.post<unknown, never, WorkPostBody>('/', validateAuthentication, asyncHandler(async (req, res) => {
	await addWork(req.body)
	res.status(200).send()
}))

router.put<{id: number}, never, WorkUpdateBody>('/:id([0-9]+)', validateAuthentication, asyncHandler(async (req, res) => {
	await updateWork(req.params.id, req.body)
	res.status(200).send()
}))

export default router
