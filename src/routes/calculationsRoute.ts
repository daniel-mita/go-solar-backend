import express from "express"
import * as calculationsController from "../controller/calculationsController"
const checkAuth = require("../middleware/check-auth")

const router = express.Router()

router.post(
  "/calculations",
  checkAuth,
  calculationsController.calculatePositioning
)

export default router