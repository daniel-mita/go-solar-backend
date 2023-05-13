import express from "express"
import * as imageController from "../controller/imageController"
const checkAuth = require("../middleware/check-auth")

const router = express.Router()

router.post("/upload", checkAuth, imageController.uploadImage)
router.post("/save", checkAuth, imageController.saveImage)
router.get("/list", checkAuth, imageController.fetchImages)
router.delete("/remove/:id", checkAuth, imageController.deleteImage)

export default router
