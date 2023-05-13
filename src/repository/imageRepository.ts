import { Image, User } from "../models"

const findAllImages = async (userId: string) => {
  return await Image.findAll({ where: { userId: userId } })
}

const createImage = async (payload: string, user: User) => {
  return await Image.create({ imageData: payload, userId: user.id, user })
}

const removeImage = async (id: string) => {
  return await Image.destroy({
    where: { id: id },
  })
}

export { findAllImages, createImage, removeImage }
