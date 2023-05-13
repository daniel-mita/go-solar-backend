import { Model, DataTypes, Association } from "sequelize"
import sequelize from "../config/sequelize/connection"
import { Image } from "./Image"

class User extends Model {
  declare id: string
  declare email: string
  declare username: string
  declare password: string
  declare avatarSeed: string

  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  public static associations: {
    images: Association<User, Image>
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatarSeed: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    modelName: "User",
  }
)

export { User }
