import express from 'express'
import {
  handleCompanyRegister,
  handleCompanyLogin,
  handleCompanyVerifyOtp,
  handleCompanyPasswordResetRequest,
  handleCompanyPasswordReset
} from '../controllers/companyController.js'

const companyRouter = express.Router()

companyRouter.post('/company-register', handleCompanyRegister)

companyRouter.post('/company-verify-otp', handleCompanyVerifyOtp)

companyRouter.post('/company-login', handleCompanyLogin)

companyRouter.post('/company-password-reset-request', handleCompanyPasswordResetRequest)

companyRouter.post('/company-password-reset', handleCompanyPasswordReset)

export { companyRouter }  