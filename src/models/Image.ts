import { Model, DataTypes, Association } from "sequelize"
import sequelize from "../config/sequelize/connection"
import { User } from "./User"

class Image extends Model {
  declare id: string
  declare imageData: DataTypes.TextDataType

  declare readonly createdAt: Date

  public static associations: {
    images: Association<User, Image>
  }
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageData: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "images",
    modelName: "Image",
  }
)

export { Image }
