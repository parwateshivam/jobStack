import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { redisClient } from "./redisClient.js"
import ejs from 'ejs'

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

    const htmlContent = await ejs.renderFile("views/emailOTP.ejs", { otp });

    const emailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Email Verification OTP | Valid for 5 mins",
      html: htmlContent,
    }

    await transporter.sendMail(emailOptions)

    await redisClient.setEx(`email:${email}`, 300, otp)

    return { message: "OTP sent successfully", status: true }

  } catch (err) {
    console.log("Error sending OTP:", err)
    return { message: "Unable to send OTP", status: false }
  }
}

async function sendOTPForPasswordReset(email) {
  try {
    const otp = generateRandomOTP()

    const htmlContent = await ejs.renderFile('views/emailOTP.ejs', { otp })

    const emailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset Request!",
      html: htmlContent,
    }

    await transporter.sendMail(emailOptions)

    await redisClient.setEx(`emailPasswordReset:${email}`, 300, otp)

    return { message: "OTP sent successfully!", status: true }

  } catch (err) {
    console.log("Error sending reset OTP:", err)
    return { message: "Unable to send OTP!", status: false }
  }
}

export { sendOTP, sendOTPForPasswordReset }
