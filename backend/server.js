import express from 'express'
import dotenv from 'dotenv'
import { userRouter } from './routes/userRouter.js'
import { conn } from './database/conn.js'
import cors from 'cors'
import { companyRouter } from './routes/companyRouter.js'

dotenv.config({ path: "./config.env" })
conn()

const app = express()
let port = process.env.PORT || 3000


const corsOptions = {
  origin: "*",
  methods: "*"
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', "ejs");

app.use(cors(corsOptions))

app.use("/user", userRouter)

app.use("/company", companyRouter)

app.use((req, res) => {
  console.log("user trying to access invalid route !")
  res.status(404).json({ message: "content/route not found !" })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})