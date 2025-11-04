import express from 'express'
import {
  handleRegisterUser,
  handleVerifyOtp,
  handleLoginUser,
  handlePasswordResetRequest,
  handleResetPassword,
  handleUserFileUpload
} from '../controllers/userController.js'
import { upload } from '../utils/multerConfig.js'
import { authUser } from '../middlewares/authUser.js'

const userRouter = express.Router()

userRouter.post('/user-register', handleRegisterUser)

userRouter.post('/user-verify-otp', handleVerifyOtp)

userRouter.post('/user-login', handleLoginUser)

userRouter.post('/password-reset-request', handlePasswordResetRequest)

userRouter.post('/reset-password', handleResetPassword)

userRouter.post('/upload-file/:file_type', authUser, upload.single('file'), handleUserFileUpload)

export { userRouter }



