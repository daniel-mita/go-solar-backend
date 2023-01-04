import express from "express"
import * as imageController from "../controller/imageController"
const checkAuth = require("../middleware/check-auth")

const router = express.Router()

router.post("/upload", checkAuth, imageController.uploadImage)

export default router
