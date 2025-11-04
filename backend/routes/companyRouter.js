import express from 'express'
import {
  handleCompanyRegister,
  handleCompanyLogin,
  handleCompanyVerifyOtp
} from '../controllers/companyController.js'

const companyRouter = express.Router()

companyRouter.post('/company-register', handleCompanyRegister)

companyRouter.post('/company-verify-otp', handleCompanyVerifyOtp)

companyRouter.post('/company-login', handleCompanyLogin)

export { companyRouter }  