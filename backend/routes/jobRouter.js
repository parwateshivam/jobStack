import express from 'express'
import { authCompany } from '../middlewares/authCompany.js'
import { authUser } from '../middlewares/authUser.js'
import { createJob, handleJobAction, handleJobApplication, getJobData } from '../controllers/jobController.js'

const jobRouter = express.Router()

jobRouter.post("/add-job", authCompany, createJob)

jobRouter.post("/job-action/:action/:jobId", authCompany, handleJobAction)

jobRouter.post("/apply-for-job/:jobId", authUser, handleJobApplication)

jobRouter.get("/get-jobs", getJobData)

export { jobRouter }