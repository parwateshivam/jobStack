import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { companyModel } from "../models/companySchema.js"

dotenv.config({ path: './config.env' })

async function authCompany(req, res, next) {
  try {

    let token = req.headers.authorization

    if (!token) {
      throw ("token not found/invalid token")
    }

    let decoded = jwt.verify(token, process.env.COMPANY_JWT_SECRET)

    let company = await companyModel.findOne({ "_id": decoded.id })

    if (!company) {
      throw ("company not found")
    }

    if (!company.email.verified) {
      throw ("email not verified pls verify the email first")
    }

    req.company = company

    next()

  } catch (err) {
    console.log("auth failed with an error : ", err)
    res.status(401).json({ message: "auth company failed please login !" })
  }
}

export { authCompany }