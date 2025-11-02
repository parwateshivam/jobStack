import mongoose from "mongoose"

const companySchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  description: {
    type: String,
    required: true
  },
  companyType: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: ""
  },
  logo: {
    type: String,
    default: ""
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  timeStamp: {
    type: Date,
    default: Date.now()
  }
})

const companyModel = new mongoose.model("companies", companySchema)

export { companyModel }