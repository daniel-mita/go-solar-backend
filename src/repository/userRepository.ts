import { User } from "../models"

const fetchUserById = async (id: string) => {
  return await User.findOne({ where: { id: id } })
}

const fetchUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email: email } })
}

const createUser = async (payload: Partial<User>) => {
  const user = await User.create(payload)

  return user.toJSON()
}

const updateUser = async (payload: Partial<User>, id: string) => {
  const user = await User.findOne({ where: { id } })

  if (!user) {
    throw new Error()
  }

  return await user.update(payload)
}

export { fetchUserById, updateUser, fetchUserByEmail, createUser }
