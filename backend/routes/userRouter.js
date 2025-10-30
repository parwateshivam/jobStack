import express from 'express'
import { handleRegisterUser, handleVerifyOtp } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', handleRegisterUser)

userRouter.post('/verify-otp', handleVerifyOtp)

export { userRouter }