import asyncHandler from 'express-async-handler'
import express from 'express'
import {getFile} from '../services/filesService'

const router = express.Router()

router.get<{ name: string }>('/:name', asyncHandler(async (req, res) => {
	switch (req.params.name.split('.').pop()) {
	case 'pdf':
		res.contentType('application/pdf')
		res.setHeader('Content-Disposition', `inline;filename=${req.params.name}`)
		break
	default:
		res.contentType('application/octet-stream')
	}

	res.status(200).send(await getFile(req.params.name))
}))

export default router
