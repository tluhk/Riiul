import asyncHandler from 'express-async-handler'
import express from 'express'
import optionalAuthentication from '../middleware/optionalAuthentication'
import {getAuthors} from '../services/authorsService'

const router = express.Router()

router.get<unknown, string[]>('/', optionalAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send(await getAuthors(res.locals.user))
}))

export default router
