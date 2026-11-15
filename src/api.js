const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function searchCities(query) {
  const url = new URL(GEO_URL)
  url.search = new URLSearchParams({
    name: query,
    count: '7',
    language: 'en',
    format: 'json',
  }).toString()

  const response = await fetch(url)
  if (!response.ok) throw new Error('City search is temporarily unavailable.')
  const data = await response.json()
  return data.results || []
}

export async function getForecast(city) {
  const url = new URL(FORECAST_URL)
  url.search = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: '14',
  }).toString()

  const response = await fetch(url)
  if (!response.ok) throw new Error('Could not load the forecast for this city.')
  return response.json()
}