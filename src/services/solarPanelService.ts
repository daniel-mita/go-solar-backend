import {
  createPanel,
  fetchPanelByDimensionsAndCapacity,
} from "../repository/solarpanelRepository"

const savePanelFromScrapper = async (tableData: any) => {
  //map data from scrapped resource
  const producer = tableData["Brand"]
  const modelName = tableData["Model"]
  const price = tableData["pret"]
  const powerType = tableData["Tip panou"].split(",")[0].trim()
  const capacity = parseInt(tableData["Putere max Pmax"].replace(/\D/g, ""))
  const efficiency = parseFloat(tableData["Eficienta"].replace("%", ""))
  const [length, width, height] = tableData["Dimensiuni"]
    .split(" x ")
    .map((val) => parseInt(val))

  const existingPanel = await fetchPanelByDimensionsAndCapacity(
    width,
    length,
    capacity
  )
  if (existingPanel) return existingPanel
  const panel = await createPanel({
    modelName,
    capacity,
    length,
    width,
    height,
    price,
    producer,
    efficiency,
    powerType,
  })
  return panel
}

export { savePanelFromScrapper }
