import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import validateAuthentication from './validateAuthentication'

async function optionalAuthentication(req: Request<never>, res: Response, next: NextFunction) {
	if (req.headers.authorization) validateAuthentication(req, res, next)
	else next()
}

export default asyncHandler(optionalAuthentication)
