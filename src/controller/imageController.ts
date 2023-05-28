import path from "path"
import fs from "fs/promises"
import sharp from "sharp"
import events from "events"
import { spawn } from "child_process"
import { Request, Response } from "express"
import {
  createImage,
  findAllImages,
  removeImage,
} from "../repository/imageRepository"
import { fetchUserById } from "../repository/userRepository"

const readFile = async () => {
  const filePath = path.join(
    __dirname,
    "..",
    "imageGenerator",
    "outputresized.jpg"
  )

  const data = await fs.readFile(filePath)
  const base64Image = Buffer.from(data).toString("base64")
  return base64Image
}

async function resizeImage(buf: Buffer) {
  try {
    // const metadata = await sharp(buf).metadata()
    await sharp(buf)
      .resize({
        width: 105,
      })
      .toFile(`./src/imageGenerator/resized.jpg`)
  } catch (error) {
    console.log(error)
    throw error
  }
}

const uploadImage = async (req: Request, res: Response) => {
  const file = req.body.image
  const myEmitter = new events.EventEmitter()

  try {
    const buf = Buffer.from(file, "base64")
    // fs.writeFileSync(filePath, buf)

    await resizeImage(buf)

    const child = spawn("python3", ["rooftop.py"], {
      cwd: "./src/imageGenerator",
    })

    child.stdout.on("data", (data) => {
      console.log(data)
    })

    child.on("exit", (exitCode: string) => {
      if (parseInt(exitCode) !== 0) {
        //Handle non-zero exit
      }
      myEmitter.emit("generation-finished")
    })

    child.on("error", (err: Error) => {
      console.error("Failed to start subprocess.")
      throw err
    })

    myEmitter.on("generation-finished", async () => {
      const image = await readFile()
      return res.status(200).json({ image: image })
    })

  } catch (err: any) {
    console.log(err)
    res.status(500).json({
      error: {
        message: err.message,
      },
    })
  }
}

const fetchImages = async (req: any, res: Response) => {
  const userId = req.userData.userId

  try {
    const images = await findAllImages(userId)

    res.status(200).json({ images: images })
  } catch (err: any) {
    console.log(err)
    return res.status(500).json({
      error: {
        message: err.message,
      },
    })
  }
}

const saveImage = async (req: any, res: Response) => {
  const imageData = req.body.image
  const userId = req.userData.userId

  try {
    const user = await fetchUserById(userId)
    console.log(user)
    if (user === null) throw new Error()
    const result = await createImage(imageData, user)
    if (result) {
      res.status(200).json(result)
    }
  } catch (err: any) {
    console.log(err)
    return res.status(500).json({
      error: {
        message: err.message,
      },
    })
  }
}

const deleteImage = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const result = await removeImage(id!.toString())
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
}

export { uploadImage, saveImage, fetchImages, deleteImage }
