import { SolarPanel } from "../models"

const fetchPanel = async (id: string) => {
  return await SolarPanel.findOne({ where: { id: id } })
}

// const fetchPanels = async (id: string) => {

//  }

const fetchPanelByDimensionsAndCapacity = async (
  width: number,
  length: number,
  capacity: number
) => {
  return await SolarPanel.findOne({
    where: { length: length, width: width, capacity: capacity },
  })
}

const createPanel = async (payload: {
  modelName: string
  capacity: number
  length: number
  width: number
  height: number
  price: number
  producer: string
  efficiency: number
  powerType: string
}) => {
  return await SolarPanel.create(payload)
}

export { fetchPanel, createPanel, fetchPanelByDimensionsAndCapacity }
