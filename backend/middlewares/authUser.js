import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { userModel } from "../models/userSchema.js"

dotenv.config({ path: './config.env' })

async function authUser(req, res, next) {
  try {
    let { token } = req.headers.authorization
    if (!token) {
      throw ("token not found/invalid token")
    }
    let decoded = jwt.verify(token, process.env.JWT_SECERT)
    let user = await userModel.findOne({ "email.userEmail": decoded.email })
    if (!user) {
      throw ("user not found")
    }
    if (!user.email.verified) {
      throw ("email not verified pls verify the email first")
    }
    req.user = user
    next()
  } catch (err) {
    console.log("auth failed with an error : ", err)
    res.status(401).json({ message: "auth user failed please login !" })
  }
}

export { authUser }