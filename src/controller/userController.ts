import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import random from "random"
import { createUser, fetchUserByEmail } from "../repository/userRepository"

const avatars = [
  "Shadow",
  "Garfield",
  "Harley",
  "Maggie",
  "Cleo",
  "Fluffy",
  "Daisy",
  "Abby",
  "Fluffy",
]

const randomAvatar = () => {
  const index = random.int(0, 8)
  return avatars[index]
}

//login, user logins with email and password
const loginUser = async (req, res) => {
  const payload = req.body
  try {
    const user = await fetchUserByEmail(payload?.email)
    if (user) {
      const dbPassword = user.password
      bcrypt.compare(
        payload?.password,
        dbPassword,
        (err: { message: any }, result: any) => {
          if (err) {
            return res.status(500).json({
              error: {
                message: err.message,
              },
            })
          }

          if (result) {
            console.log(result)
            const token = jwt.sign(
              {
                userId: user.id,
                email: user.email,
                username: user.username,
              },
              process.env.JWT_KEY!,
              {
                expiresIn: "1h",
              }
            )
            return res.status(200).json({
              message: "Auth successful",
              token: token,
              avatarSeed: user.avatarSeed,
              user: user.username,
            })
          }
          //incorrect password
          return res.status(401).json({
            error: {
              message: "Auth failed",
            },
          })
        }
      )
    } else {
      return res.status(401).json({
        error: {
          message: "Auth failed",
        },
      })
    }
  } catch (err: any) {
    res.status(500).json({
      error: {
        message: err.message,
      },
    })
  }
}

//sign up
const signupUser = async (req, res) => {
  const payload = req.body
  console.log(payload)
  try {
    const user = await fetchUserByEmail(payload?.email)
    if (user) {
      return res.status(409).json({
        message: "Mail exists",
      })
    }
    bcrypt.hash(payload?.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: {
            message: err.message,
          },
        })
      }
      payload.password = hash
      try {
        payload.avatarSeed = randomAvatar()
        const result = await createUser(payload)
        if (result) {
          res.status(200).json(result)
        }
      } catch (err: any) {
        return res.status(500).json({
          error: {
            message: err.message,
          },
        })
      }
    })
  } catch (err: any) {
    res.status(500).json({
      error: {
        message: err.message,
      },
    })
  }
}

export { loginUser, signupUser }
