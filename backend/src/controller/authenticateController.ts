import asyncHandler from 'express-async-handler'
import express from 'express'
import {login} from '../services/authenticateService'
import AuthenticateLoginBody from '../types/AuthenticateLoginBody'

const router = express.Router()

router.post<unknown, unknown, AuthenticateLoginBody>('/login', asyncHandler(async (req, res) => {

	res.header('authorization', await login(req.body.email, req.body.password))
	res.status(200).send()
}))

export default router
