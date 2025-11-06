import mongoose from "mongoose"

// Sub-documents
const addressSchema = {
  street: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  pincode: {
    type: String,
    default: ""
  },
};

let emailSchema = {
  companyEmail: "",
  verified: false
}

const contactPersonScheam = {
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  }
}

const companyDetailsSchema = {
  name: {
    type: String,
    required: true
  },
  est_year: {
    type: String,
    required: true
  },
  address: {
    type: Object,
    default: addressSchema
  },
  bio: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: false
  },
  industryType: {
    type: String,
    required: true
  },
  founders: {
    type: Array
  },
  hrEmail: {
    type: String,
    required: true
  }
}

const companySchema = mongoose.Schema({
  companyDetails: {
    type: Object,
    required: true,
    default: companyDetailsSchema
  },
  contact_person: {
    type: Object,
    required: true,
    default: contactPersonScheam
  },
  email: {
    type: Object,
    required: true,
    default: emailSchema
  },
  phone: {
    type: String,
    required: true
  },
  companyLogo: {
    type: String,
    required: false,
    default: ""
  },
  documents: {
    type: Array,
    default: []
  },
  createJobs: {
    type: Array,
    default: []
  },
  password: {
    type: String,
    required: true
  }
})

const companyModel = new mongoose.model("companies", companySchema)

export { companyModel }