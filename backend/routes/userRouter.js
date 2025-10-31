import express from 'express'
import { handleRegisterUser, handleVerifyOtp, handleLoginUser, handlePasswordResetRequest, handleResetPassword } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', handleRegisterUser)

userRouter.post('/verify-otp', handleVerifyOtp)

userRouter.post('/login', handleLoginUser)

userRouter.post('/password-reset-request', handlePasswordResetRequest)

userRouter.post('/reset-password', handleResetPassword)

export { userRouter }



