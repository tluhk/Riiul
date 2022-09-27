import asyncHandler from 'express-async-handler'
import express from 'express'
import validateAuthentication from '../middleware/validateAuthentication'
import UsersPostBody from '../types/UsersPostBody'
import {addUser, deleteUser, getUser, getUsers, updateUser} from '../services/usersService'
import UserListResponse from '../types/UserListResponse'
import UserResponse from '../types/UserResponse'

const router = express.Router()

router.get<unknown, UserListResponse[]>('/', validateAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send(await getUsers())
}))

router.get<{ id: number }, UserResponse>('/:id([0-9]+)', validateAuthentication, asyncHandler(async (req, res) => {
	res.status(200).send(await getUser(req.params.id))
}))

router.post<unknown, never, UsersPostBody>('/', validateAuthentication, asyncHandler(async (req, res) => {
	await addUser(req.body)
	res.status(200).send()
}))

router.put<{id: number }, never, UsersPostBody>('/:id([0-9]+)', validateAuthentication, asyncHandler(async (req, res) => {
	await updateUser(req.params.id, req.body)
	res.status(200).send()
}))

router.delete<{id: number}, never>('/:id([0-9]+)', validateAuthentication, asyncHandler(async (req, res) => {
	await deleteUser(req.params.id, res.locals.user)
	res.status(200).send()
}))

export default router
