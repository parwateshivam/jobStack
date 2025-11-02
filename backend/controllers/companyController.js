import { companyModel } from "../models/companySchema.js"
import bcrypt from 'bcrypt'

async function handleCompanyRegister(req, res) {
  try {
    let { name, email, password, description, companyType, location } = req.body

    if (!name || !email || !password || !description || !companyType || !location) {
      throw ('invalid/missing data')
    }

    let isCompanyExist = await companyModel.findOne({ $or: [{ 'name': name }, { 'email': email }] })

    if (isCompanyExist) {
      throw ('company already exist')
    }

    let hash = await bcrypt.hash(password, 10)

    let newCompany = new companyModel({
      name,
      email,
      password: hash,
      description,
      companyType,
      location
    })

    await newCompany.save()

    res.send(202).json({ message: "company register successfully" })

  } catch (err) {
    res.status(500).json({ message: "something went wrong", error: err })
  }
}

export { handleCompanyRegister }