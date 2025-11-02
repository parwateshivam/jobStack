import express from 'express'
import { handleCompanyRegister } from '../controllers/companyController.js'

const companyRouter = express.Router()

companyRouter.post('/register', handleCompanyRegister)

export { companyRouter }