import dotenv from "dotenv"
import { redisClient } from "../utils/redisClient.js"
import { userModel } from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { sendOTP, sendOTPForPasswordReset } from "../utils/sendOtp.js"

dotenv.config({ path: "./config.env" })

const handleRegisterUser = async (req, res) => {
  try {
    const { name, phone, email, address, dob, qualifications, password } = req.body

    if (!name || !phone || !email || !address || !dob || !qualifications || !password)
      throw ("Invalid or missing data")

    const userExists = await userModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    })

    if (userExists) throw ("User already exists. Change email/phone and try again")

    const emailObject = { userEmail: email, verified: false }

    const result = await sendOTP(email)
    if (!result.status) throw (`Unable to send OTP to ${email} | ${result.message}`)

    const hash = await bcrypt.hash(password, 10)

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
      const result = await sendOTP(email) // <-- using imported function
      if (!result.status) throw `Unable to send OTP to ${email} | ${result.message}`
      throw `Email not verified. OTP sent to ${email}`
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.status(202).json({ message: "Login successful", token })

  } catch (err) {
    console.log("Error while login:", err)
    res.status(400).json({ message: "Unable to login", error: err })
  }
}

async function handlePasswordResetRequest(req, res) {
  try {
    let { email } = req.body

    if (!email) throw ("Invalid/missing data")

    const checkUser = await userModel.findOne({ "email.userEmail": email })
    if (!checkUser) throw ("User not found")

    const result = await sendOTPForPasswordReset(email)  // <-- using imported function

    if (!result.status) throw (`Unable to send OTP at ${email} | ${result.message}`)

    res.status(201).json({ message: `OTP sent to ${email} (Valid for 5 mins)` })

  } catch (err) {
    console.log("Password reset request failed!", err)
    res.status(400).json({ message: "Password reset request failed!", err })
  }
}

async function handleResetPassword(req, res) {
  try {
    let { email, otp, newPassword } = req.body;

    const emailExits = await userModel.findOne({ "email.userEmail": email })
    if (!emailExits) throw (`Email ${email} is not registered!`)

    const storedOtp = await redisClient.get(`emailPasswordReset:${email}`)
    if (!storedOtp) throw ("OTP expired/not found!")

    if (storedOtp != otp) throw ("Invalid OTP!")

    const hash = await bcrypt.hash(newPassword, 10)

    await userModel.updateOne({ "email.userEmail": email }, { $set: { "password": hash } })

    redisClient.del(`emailPasswordReset:${email}`)

    res.status(202).json({ message: "Password updated successfully. Please login!" })

  } catch (err) {
    console.log("Error while verifying the OTP:", err)
    res.status(500).json({ message: "Failed to reset password, try again later!", err })
  }
}

async function handleUserFileUpload(req, res) {
  try {
    if (!req.file) {
      throw ("failed to upload file")
    }

    let fileName = req.file.filename

    await userModel.updateOne({ "email.userEmail": req.user.email.userEmail }, { $push: { "documents": fileName } })

    let uploadDest = `uploads/${req.filename}`

    res.status(202).json({ message: "file uploaded successfully !", fileName, uploadDest })

  } catch (err) {
    console.log("failed to uplaod file")
    console.log(err)
    res.status(500).json({ message: "failed to upload the file in uploads folder :", err })
  }
}

export {
  handleRegisterUser,
  handleVerifyOtp,
  handleLoginUser,
  handlePasswordResetRequest,
  handleResetPassword,
  handleUserFileUpload
}
