import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import {generateJwtToken, validateToken} from '../services/authenticateService'
import {usersRepository} from '@riiul/repository'
import HttpErrorUnauthorized from '../shared/errors/HttpErrorUnauthorized'

async function validateAuthentication(req: Request<never>, res: Response, next: NextFunction) {
	res.locals.user = await usersRepository.findUser(validateToken(req.headers.authorization))
	if (!res.locals.user.id) throw new HttpErrorUnauthorized('INVALID_TOKEN')

	res.header('authorization', generateJwtToken(res.locals.user.id))
	next()
}

export default asyncHandler(validateAuthentication)
