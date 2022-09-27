import asyncHandler from 'express-async-handler'
import express from 'express'
import optionalAuthentication from '../middleware/optionalAuthentication'
import {getTags} from '../services/tagsService'

const router = express.Router()

router.get<unknown, string[]>('/', optionalAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send(await getTags(res.locals.user))
}))

export default router
