import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

module.exports = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY!)
    req.userData = decoded
    next()
  } catch (e) {
    res.status(401).json({
      message: "Auth failed",
    })
  }
}
