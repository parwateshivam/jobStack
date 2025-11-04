import { companyModel } from "../models/companySchema.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendOTP } from "../utils/sendOtp.js"
import { redisClient } from "../utils/redisClient.js"

async function handleCompanyRegister(req, res) {
  try {
    let { companyDetails, contact_person, email, phone, password } = req.body

    if (!companyDetails || !contact_person || !phone || !email || !password) {
      throw ('invalid/missing data')
    }

    let isCompanyExist = await companyModel.findOne({
      $or: [{ "email.companyEmail": email }, { phone }]
    })

    if (isCompanyExist) {
      throw ('email/phone already exist try with another one')
    }

    let hash = await bcrypt.hash(password, 10)

    let emailSchema = {
      companyEmail: email,
      verified: false
    }

    const result = await sendOTP(email)
    if (!result.status) throw (`Unable to send OTP to ${email} | ${result.message}`)

    let newCompany = new companyModel({
      companyDetails,
      contact_person,
      phone,
      email: emailSchema,
      password: hash
    })

    await newCompany.save()

    res.send(202).json({ message: `company register successfully and otp sent to ${email} pls verify your email` })

  } catch (err) {
    res.status(500).json({ message: "something went wrong", error: err })
  }
}

async function handleCompanyVerifyOtp(req, res) {
  try {
    let { email, opt } = req.body

    const company = await companyModel.findOne({ "email.companyEmail": email })
    if (!company) {
      throw ("company/email not found/register")
    }

    const storedOtp = await redisClient.get(`email:${email}`)
    if (!storedOtp) {
      throw ("opt expired/not found")
    }

    if (sendOTP != opt) {
      throw ("otp mismatch or expires")
    }

    await companyModel.updateOne(
      { "email.companyEmail": email },
      { $set: { "email.verified": true } }
    )

    redisClient.del(`email:${email}`)

    res.status(202).json({ message: "OTP verified successfully. Please log in." })

  } catch (err) {
    console.log("Error while verifying OTP:", err)
    res.status(500).json({ message: "Failed to verify OTP", error: err })
  }
}

async function handleCompanyLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ("Email and password are required");
    }

    const company = await companyModel.findOne({ "email.companyEmail": email });
    if (!company) {
      throw ("Company not found");
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      throw ("Invalid email or password");
    }

    if (!company.email.verified) {
      const result = await sendOTP(email)
      if (result.status == false) throw `Unable to send OTP to ${email} | ${result.message}`
      throw `Email not verified. OTP sent to ${email} pls verify your email first`
    }

    const token = jwt.sign(
      { id: company._id },
      process.env.COMPANY_JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });

  } catch (err) {
    console.error("Error during company login:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}

export {
  handleCompanyRegister,
  handleCompanyLogin,
  handleCompanyVerifyOtp
}