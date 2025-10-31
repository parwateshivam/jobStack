import mongoose from "mongoose"

let addressObject = {
  street: "",
  city: "",
  state: "",
  country: "",
  pincode: ""
}

let emailObject = {
  userEmail: "",
  verified: false
}

let userShcema = mongoose.Schema({
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
    default: addressObject
  },
  dob: {
    type: String,
    require: true
  },
  qualifications: {
    type: String,
    default: ""
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

let userModel = new mongoose.model("users", userShcema)

export { userModel }