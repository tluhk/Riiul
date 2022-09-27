import WorkListResponse from '../types/WorkListResponse'
import asyncHandler from 'express-async-handler'
import {getPreviewWorks} from '../services/worksService'
import express from 'express'

const router = express.Router()

router.get<never, Record<number, WorkListResponse[]>>('/', asyncHandler(async (req, res) => {
	res.status(200).send(await getPreviewWorks())
}))

export default router
