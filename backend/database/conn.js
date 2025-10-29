import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({ path: "../config.env" })

async function conn() {
  try {
    await mongoose.connect(process.env.MONGO_URI_STRING)
    console.log("database connected successfully");
  } catch (err) {
    console.log("unable to connect : ", err);
  }
}

export { conn }