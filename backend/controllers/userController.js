import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { redisClient } from "../utils/redisClient.js"
import { userModel } from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

dotenv.config({ path: "./config.env" })

// Nodemailer config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
})

// Generate 4-digit OTP
function generateRandomOTP() {
  return Math.floor(Math.random() * 9000 + 1000).toString()
}

async function sendOTP(email) {
  try {
    const otp = generateRandomOTP()

    const emailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Email Verification OTP | Valid for 5 mins",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    }

    await transporter.sendMail(emailOptions)

    await redisClient.setEx(`email:${email}`, 300, otp) // store otp for 5 mins

    return { message: "OTP sent successfully", status: true }

  } catch (err) {
    console.log("Error sending OTP:", err)
    return { message: "Unable to send OTP", status: false }
  }
}

async function sendOTPForPasswordReset(email) {
  try {

    let otp = genrateRandomNumber()

    let emailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset Request !",
      text: `your otp is ${otp} valid for 5 mins please use this otp to reset your password !`,
    }

    await transporter.sendMail(emailOptions)

    redisClient.setEx(`emailPasswordReset:${email}`, 300, otp)

    return { messag: "otp sent successfully !", status: true }

  } catch (err) {
    console.log("error sending otp : ", err)
    return { message: "unable to send otp !", status: false }
  }
}

const handleRegisterUser = async (req, res) => {
  try {
    const { name, phone, email, address, dob, qualifications, password } = req.body

    if (!name || !phone || !email || !address || !dob || !qualifications || !password)
      throw "Invalid or missing data"

    // Check if user already exists
    const userExists = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    })

    if (userExists) throw "User already exists. Change email/phone and try again"

    const emailObject = { userEmail: email, verified: false }

    // Send OTP
    const result = await sendOTP(email)
    if (!result.status) throw `Unable to send OTP to ${email} | ${result.message}`

    // Hash password
    const hash = await bcrypt.hash(password, 10)

    // Create user
    const newUser = new userModel({
      name,
      phone,
      email: emailObject,
      address,
      dob,
      qualifications,
      password: hash,
    })

    await newUser.save()

    res.status(202).json({
      message: `User registered successfully. Please verify the OTP sent to ${email}`,
    })

  } catch (err) {
    console.log("Error while registering user:", err)
    res.status(400).json({ message: "Unable to register user", error: err })
  }
}

async function handleVerifyOtp(req, res) {
  try {
    const { email, otp } = req.body

    const user = await userModel.findOne({ "email.userEmail": email })
    if (!user) throw `Email ${email} is not registered`

    const storedOtp = await redisClient.get(`email:${email}`)
    if (!storedOtp) throw "OTP expired or not found"

    if (storedOtp !== otp) throw "Invalid OTP"

    // Update verification status
    await userModel.updateOne(
      { "email.userEmail": email },
      { $set: { "email.verified": true } }
    )

    redisClient.del(`email:${email}`)

    res.status(202).json({ message: "OTP verified successfully. Please log in." })

  } catch (err) {
    console.log("Error while verifying OTP:", err)
    res.status(500).json({ message: "Failed to verify OTP", error: err })
  }
}

async function handleLoginUser(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) throw "Invalid or missing data"

    const user = await userModel.findOne({ "email.userEmail": email })
    if (!user) throw "User not found. Please register first"

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw "Incorrect email or password"

    if (!user.email.verified) {
      const result = await sendOTP(email)
      if (!result.status) throw `Unable to send OTP to ${email} | ${result.message}`
      throw `Email not verified. OTP sent to ${email}`
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.status(202).json({
      message: "Login successful",
      token,
    })

  } catch (err) {
    console.log("Error while login:", err)
    res.status(400).json({ message: "Unable to login", error: err })
  }
}

async function handlePasswordResetRequest(req, res) {
  try {
    let { email } = req.body

    if (!email) throw ("invalid/missing data")

    let checkUser = await findOne({ "email.userEmail": email })

    if (!checkUser) throw ("user not found")

    let result = await sendOTPForPasswordReset(email)

    if (!result.status) throw (`unable to send otp at ${email} | ${result.message}`)

    res.status(201).json({ messag: `an otp sent to your email ${email} | valid for 5 mins to reset your password !` })

  } catch (err) {
    console.log("password reset request failed !", err)
    res.status(400).json({ messag: "password reset request failed !", err })
  }
}

async function handleResetPassword(req, res) {
  try {
    let { email, otp, newPassword } = req.body;

    let emailExits = await userModel.findOne({ "email.userEmail": email })

    if (!emailExits) throw (`email ${email} is not registred !`)

    let storedOtp = await redisClient.get(`emailPasswordReset:${email}`)

    if (!storedOtp) throw ("otp is expried/not found !")

    if (storedOtp != otp) throw ("invalid otp !")

    console.log('otp matched successfully for password reset !')

    let hash = await bcrypt.hash(newPassword, 10)

    await userModel.updateOne({ "email.userEmail": email }, { $set: { "password": hash } })

    redisClient.del(`emailPasswordReset:${email}`)

    res.status(202).json({ message: "otp verified successfully and password has been changed please head to login !" })

  } catch (err) {
    console.log("error while verifying the otp : ", err)
    res.status(500).json({ message: "failed to verify user otp please try again later !", err })
  }
}

export {
  handleRegisterUser,
  handleVerifyOtp,
  handleLoginUser,
  handlePasswordResetRequest,
  handleResetPassword
}
