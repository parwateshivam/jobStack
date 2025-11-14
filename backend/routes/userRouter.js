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
import { userModel } from '../models/userSchema.js'

const userRouter = express.Router()

userRouter.post('/user-register', handleRegisterUser)

userRouter.post('/user-verify-otp', handleVerifyOtp)

userRouter.post('/user-login', handleLoginUser)

userRouter.post('/user-password-reset-request', handlePasswordResetRequest)

userRouter.post('/user-password-reset', handleResetPassword)

userRouter.post('/upload-file/:filetype', authUser, upload.single('file'), handleUserFileUpload)

userRouter.get('/fetch-user-profile', authUser, async (req, res) => {
  try {
    let user = req.user

    let userData = await userModel.findOne({ "email.userEmail": user.email.userEmail })

    if (!userData) throw ("unable to load user profile !")

    res.status(200).json({ message: "got user profile data !", userData })

  } catch (err) {
    console.log("unable to user profile : ", err)
    res.state(401).json({ message: "unable to send user profile data !", err })
  }
})

export { userRouter }