import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let fileType = req.params.filetype
    fileType = fileType + "s"

    if (fileType === "resumes") {
      cb(null, "uploads/resumes/")
    }
    else if (fileType === "companyLogos") {
      cb(null, "uploads/companyLogos/")
    }
    else if (fileType === "profile_pictures") {
      cb(null, "uploads/profile_pictures")
    }
    else {
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