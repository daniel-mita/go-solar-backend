import { Request, Response } from "express"
import { getAreaOfPolygon, getCenter } from "geolib"
import { fetchConversionRate, fetchSolarData } from "../services/liveDataLayer"
import { savePanelFromScrapper } from "../services/solarPanelService"
import { scrapeUTB } from "../services/utb-scrapper"
const turf = require("@turf/turf")

function findMaxRectangle(coordinates) {
  const polygonPoints = coordinates.map(
    (point: { lat: number; lon: number }) => [point.lon, point.lat]
  )

  // Convert coordinates to turf polygon
  const polygon = turf.polygon([polygonPoints])

  // Get the convex hull of the polygon
  const convexHull = turf.convex(polygon)

  // Find the maximum inscribed rectangle using the Rotating Calipers algorithm
  let maxArea = 0
  let maxWidth = 0
  let maxHeight = 0
  let maxRectangle: any
  const hullCoords = convexHull.geometry.coordinates[0]
  for (let i = 0; i < hullCoords.length - 1; i++) {
    for (let j = i + 1; j < hullCoords.length; j++) {
      const perpendicular = turf.lineString([
        hullCoords[j],
        [
          hullCoords[j][0] + hullCoords[i][1] - hullCoords[j][1],
          hullCoords[j][1] + hullCoords[j][0] - hullCoords[i][0],
        ],
      ])
      const intersection = turf.lineIntersect(polygon, perpendicular)
      if (intersection.features.length > 0) {
        const dist1 = turf.distance(hullCoords[i], intersection.features[0], {
          units: "meters",
        })
        const dist2 = turf.distance(hullCoords[j], intersection.features[0], {
          units: "meters",
        })
        const area = dist1 * dist2
        if (area > maxArea) {
          maxArea = area
          maxWidth = Math.max(dist1, dist2)
          maxHeight = Math.min(dist1, dist2)
          const rectangleCoords = [
            hullCoords[i],
            intersection.features[0].geometry.coordinates,
            hullCoords[j],
            [
              hullCoords[j][0] + hullCoords[i][1] - hullCoords[j][1],
              hullCoords[j][1] + hullCoords[j][0] - hullCoords[i][0],
            ],
            hullCoords[i],
          ]
          maxRectangle = turf.polygon([rectangleCoords])
        }
      }
    }
  }

  return {
    area: maxArea,
    width: maxWidth,
    height: maxHeight,
  }
}

const computePanelsData = async (
  angle: number,
  coordinates: { longitude: number; latitude: number },
  numberOfPanels: number,
  panelRating: number,
  panelPrice: number,
  kWPrice: number,
  annualConsumption: number
) => {
  const capacity = Number((numberOfPanels * panelRating).toFixed(2))
  const lat = Number(coordinates.latitude.toFixed(4))
  const lon = Number(coordinates.longitude.toFixed(4))

  const solarData = await fetchSolarData(lat, lon, angle, capacity)

  const averageAnnualEnergyProduction = Number(
    solarData.outputs.ac_annual.toFixed(2) * 0.8
  )
  const conversionRates = await fetchConversionRate(["RON"], "EUR")
  const eurPrice = conversionRates.RON

  const averageInvertorPricePerkWLei = 600
  const averageCostPerPanel = 200 // 200 lei estimated price per panel installation + others
  const invertorCapacityOverflow = 0.15 // invertor capacity needs to be 10% higher than system capacity

  const neededInvertorCapacity = capacity + invertorCapacityOverflow * capacity

  const panelCosts = (numberOfPanels * panelPrice) / eurPrice

  const invertorCosts =
    (neededInvertorCapacity * averageInvertorPricePerkWLei) / eurPrice

  const instalation = (averageCostPerPanel * numberOfPanels) / eurPrice

  const generatedPerYearAmount =
    (averageAnnualEnergyProduction * kWPrice) / eurPrice

  const recoverMoney = Number(
    (
      (invertorCosts + panelCosts + instalation) /
      generatedPerYearAmount
    ).toFixed(2)
  )

  const producedAmount =
    generatedPerYearAmount - (annualConsumption * kWPrice) / eurPrice

  const producedElectricity = averageAnnualEnergyProduction - annualConsumption

  return {
    averageAnnualEnergyProduction,
    capacity,
    panelCosts,
    generatedPerYearAmount,
    recoverMoney,
    producedAmount,
    producedElectricity,
    invertorCosts,
    instalation,
  }
}

const calculatePositioning = async (req: Request, res: Response) => {
  const coordinates = req.body.coordinates
  const annualConsumption = req.body.configurations.annualConsumption
  const reservedSpace = req.body.configurations.reservedSpace
  const angle = req.body.configurations.angle
  const kWPrice = req.body.configurations.kWPrice

  const areaCenter = getCenter(coordinates)

  const tableRows = await scrapeUTB()
  const panel = await savePanelFromScrapper(tableRows)

  // convert milimiters to meters and round to 2 decimals max
  const width = Math.round(panel.width / 10) / 100
  const height = Math.round(panel.length / 10) / 100

  const geographicPolygonArea = getAreaOfPolygon(coordinates)
  coordinates.push(coordinates[0])

  const panelArea = width * height // Area of a single panel

  const rectangleData = findMaxRectangle(coordinates) // max enscribed rectangle
  let numberOfPanels = 0
  if (
    rectangleData.area === 0 ||
    rectangleData.height === 0 ||
    rectangleData.width === 0
  ) {
    numberOfPanels = Math.floor(
      (geographicPolygonArea - (geographicPolygonArea * reservedSpace) / 100) /
        panelArea
    ) // number of panels if the polygon provided is convex or there is an error in the coordinates provided
  } else {
    numberOfPanels = Math.floor(
      (rectangleData.area - (rectangleData.area * reservedSpace) / 100) /
        panelArea
    )
  }

  let panelsData = await computePanelsData(
    angle,
    areaCenter as unknown as { longitude: number; latitude: number },
    numberOfPanels,
    panel.capacity / 1000, // panel power rating in kW
    panel.price,
    kWPrice,
    annualConsumption
  )

  const results = {
    maximum: {
      panelsNumber: numberOfPanels,
      installedPower: panelsData.capacity,
      panelsCost: panelsData.panelCosts,
      recoverPeriod: panelsData.recoverMoney,
      generatedMoney: panelsData.generatedPerYearAmount,
      generatedElectricity: panelsData.averageAnnualEnergyProduction,
      consumedMoney: panelsData.producedAmount,
      consumedElectricity: panelsData.producedElectricity,
    },
    aditionalCosts: {
      invertor: Math.floor(panelsData.invertorCosts),
      installation: Math.floor(panelsData.instalation),
    },
  }

  res.status(200).json({ results })
}

export { calculatePositioning }
