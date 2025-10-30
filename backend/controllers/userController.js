import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { userModel } from '../models/userSchema.js'
import { redisClient } from '../utils/redisClient.js'

dotenv.config({ path: "../config.env" })

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  }
})

function generateRandomNumber() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function sendOtp(email) {
  try {
    const otp = generateRandomNumber()

    const emailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Your OTP to Verify Email | Valid for 5 mins",
      text: `Your OTP is ${otp}`
    }

    await transporter.sendMail(emailOptions)

    await redisClient.setEx(`email:${email}`, 300, otp)

    return { message: "OTP sent successfully!", status: true }

  } catch (err) {
    console.log("Error sending OTP:", err)
    return { message: "Unable to send OTP!", status: false, err }
  }
}

async function handleRegisterUser(req, res) {
  try {
    const { name, email, password, address, dob, qualifications, phone } = req.body

    if (!name || !email || !password || !address || !dob || !qualifications || !phone) {
      throw new Error("Invalid/Missing data!")
    }

    const userExist = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }]
    })

    if (userExist) {
      throw new Error("Email/Phone already exists!")
    }

    let emailObject = {
      userEmail: email,
      verified: false
    }

    const result = await sendOtp(email)
    if (!result.status) throw new Error(result.message)

    const newUser = new userModel({
      name,
      email: emailObject,
      password,
      address,
      dob,
      qualifications,
      phone
    })

    await newUser.save()

    res.status(202).json({
      message: `User registered! OTP sent to ${email}. Please verify your email.`
    })

  } catch (err) {
    console.log("Error while registering user:", err)
    res.status(400).json({ message: err.message || "Unable to register user!" })
  }
}

async function handleVerifyOtp(req, res) {
  try {
    const { email, otp } = req.body

    const user = await userModel.findOne({ "email.userEmail": email })
    if (!user) throw new Error(`${email} not found! Please register first.`)

    const storedOtp = await redisClient.get(`email:${email}`)
    if (!storedOtp) throw new Error("OTP expired or not found!")

    if (storedOtp !== otp) throw new Error("Invalid OTP!")

    await userModel.updateOne(
      { "email.userEmail": email },
      { $set: { "email.verified": true } }
    )

    await redisClient.del(`email:${email}`)

    res.status(202).json({ message: "OTP verified successfully! Please login." })

  } catch (err) {
    console.log("Error while verifying OTP:", err)
    res.status(500).json({ message: err.message || "Failed to verify OTP!" })
  }
}

export { handleRegisterUser, handleVerifyOtp }
