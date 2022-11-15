import express from "express"
import * as userController from "../controller/userController"

const router = express.Router()

router.post("/login", userController.loginUser)
router.post("/signup", userController.signupUser)

export default router
