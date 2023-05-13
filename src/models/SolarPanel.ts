import { Model, DataTypes } from "sequelize"
import sequelize from "../config/sequelize/connection"

class SolarPanel extends Model {
  declare id: string
  declare modelName: string
  declare capacity: number
  declare length: number
  declare width: number
  declare height: number
  declare price: number
  declare producer: string
  declare efficiency: number
  declare powerType: string
}

SolarPanel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    length: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    width: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    height: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    producer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    efficiency: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    powerType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "solarpanels",
    modelName: "SolarPanel",
  }
)

export { SolarPanel }
