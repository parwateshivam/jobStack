import express from 'express'
import {
  handleCompanyRegister,
  handleCompanyLogin,
  handleCompanyVerifyOtp,
  handleCompanyPasswordResetRequest,
  handleCompanyPasswordReset,
  handleSubmitCompanyLogo
} from '../controllers/companyController.js'
import { authCompany } from '../middlewares/authCompany.js'
import { upload } from '../utils/multerConfig.js'

const companyRouter = express.Router()

companyRouter.post('/company-register', handleCompanyRegister)

companyRouter.post('/company-verify-otp', handleCompanyVerifyOtp)

companyRouter.post('/company-login', handleCompanyLogin)

companyRouter.post('/company-password-reset-request', handleCompanyPasswordResetRequest)

companyRouter.post('/company-password-reset', handleCompanyPasswordReset)

companyRouter.post('/upload-file/:filetype', authCompany, upload.single('file'), handleSubmitCompanyLogo)

export { companyRouter }  