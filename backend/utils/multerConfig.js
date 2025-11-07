import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    let fileType = req.params.filetype

    if (fileType === "resume") {
      cb(null, "uploads/resumes/")
    }else if (fileType === "company_logo") {
      cb(null, "uploads/companyLogos/")
    }else if (fileType === "profile_picture") {
      cb(null, "uploads/profile_pictures")
    }else if(fileType === "company_document"){
      cb(null, "uploads/companyDocs")
    }else {
      console.log("invalid file type")
    }

  },
  filename: (req, file, cb) => {

    const extension = file.originalname;

    const uniqueName = `${new Date().getTime()}-${extension}`

    cb(null, uniqueName)
    
  }
})

const upload = multer({ storage })

export { upload }