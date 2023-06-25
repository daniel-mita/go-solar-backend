import axios, { AxiosRequestConfig } from "axios"
import { CONVERSION_RATE_API_KEY, SOLAR_DATA_API_KEY } from "../constant"

async function fetchConversionRate(symbols: string[], base: string) {
  try {
    const apiKey = CONVERSION_RATE_API_KEY
    const headers = {
      "Content-Type": "application/json",
      apikey: apiKey,
    }
    const config: AxiosRequestConfig = {
      method: "GET",
      headers,
      url: `https://api.apilayer.com/fixer/latest?symbols=${symbols}&base=${base}`,
    }

    const response = (await axios(config)) as any

    return response.data.rates
  } catch (error) {
    console.error(error)
  }
}

async function fetchSolarData(latitude: number, longitude: number, tilt: number, capacity: number) {
  try {
    const apiKey = SOLAR_DATA_API_KEY

    const headers = {
      'Content-Type': 'application/json',
      apikey: apiKey,
    }

    const config: AxiosRequestConfig = {
      method: 'GET',
      headers,
      url: `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${apiKey}&format=json&lat=${latitude}&lon=${longitude}&system_capacity=${capacity}&module_type=1&losses=14&array_type=1&azimuth=180&tilt=${tilt}&dataset=intl`,
    }
    const response = await axios(config);

    const data = response.data;

    return data

  } catch (error) {
    console.error(error)
  }
}

export { fetchConversionRate , fetchSolarData}
