import express from 'express'
import { test, handleRegisterUser } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get("/test", test)

userRouter.post('/register', handleRegisterUser)

export { userRouter }