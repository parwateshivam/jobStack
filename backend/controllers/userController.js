import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { userModel } from '../models/userSchema'

dotenv.config({ path: "../config.env" })

const transporter = nodemailer.createTransport({
  host: 'smtp.gamil.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  }
})

function test(req, res) {
  res.send("hello")
}

async function handleRegisterUser(req, res) {
  try {
    let { name, email, password, address, dob, qualifications, phone } = req.body

    if (!name || !email || !password || !address || !dob || !qualifications || !phone) {
      throw ("missing data")
    }

    const userExist = await userModel.findOne({ email })
    if (userExist) {
      res.status(400).json({ message: "email already exist" })
    }

    let newUser = new userModel({
      name,
      email,
      password,
      address,
      dob,
      qualifications,
      phone
    })

    await newUser.save()
  } catch (err) {
    console.log("error while registering user : ", err)
    res.status(400).json({ message: "unable to register user !", err })
  }
}

export { test, handleRegisterUser }