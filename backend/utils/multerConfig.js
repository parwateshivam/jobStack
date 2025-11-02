import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const extension = file.originalname;
    const uniqueName = `${new Date().getTime()}-${extension}`
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

export { upload }