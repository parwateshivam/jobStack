import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import { verify } from 'jsonwebtoken'

let addObject = {
  street: "",
  city: "",
  state: "",
  country: "",
  pincode: ""
}

let emailObject = {
  email: "",
  verify: false
}

let userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: Object,
    require: true,
    default: emailObject
  },
  password: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  address: {
    type: Object,
    require: true,
    default: addObject
  },
  dob: {
    type: String,
    require: true
  },
  qualifications: {
    type: Array,
    default: []
  },
  documents: {
    type: Array,
    default: []
  },
  appliedJobs: {
    type: Array,
    default: []
  },
  timeStamp: {
    type: Date,
    default: Date.now()
  }
})

userSchema.pre("save", async function () {
  try {
    this.password = await bcrypt.hash(this.password, 10)
  } catch (err) {
    console.log("error in pre method : ", err)
  }
})

const userModel = new mongoose.model("user", userSchema)

export { userModel }