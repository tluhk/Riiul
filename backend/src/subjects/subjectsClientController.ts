import asyncHandler from 'express-async-handler'
import express from 'express'
import {getPublicSubjects} from './subjectsService'
import {SubjectsClientResponse} from "./models"
import {ResponseHolder} from "@riiul/models";

const router = express.Router()

router.get<unknown, ResponseHolder<SubjectsClientResponse[]>>('/', asyncHandler(async (req, res) => {
	res.status(200).send({
		data: await getPublicSubjects(),
		errors: []
	})
}))

export default router
