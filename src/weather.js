export function weatherInfo(code) {
  if (code === 0) return { label: 'Clear sky', icon: '☀️', tone: 'sun' }
  if ([1, 2].includes(code)) return { label: code === 1 ? 'Mainly clear' : 'Partly cloudy', icon: '🌤️', tone: 'sun' }
  if (code === 3) return { label: 'Overcast', icon: '☁️', tone: 'cloud' }
  if ([45, 48].includes(code)) return { label: 'Fog', icon: '🌫️', tone: 'cloud' }
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: '🌦️', tone: 'rain' }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rain showers', icon: '🌧️', tone: 'rain' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', icon: '❄️', tone: 'snow' }
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: '⛈️', tone: 'storm' }
  return { label: 'Variable conditions', icon: '🌡️', tone: 'cloud' }
}

export function formatDay(date, index) {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' })
}

export function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric'
  })
}

export function convertTemp(value, unit) {
  if (value == null) return '—'
  return Math.round(unit === 'F' ? (value * 9 / 5) + 32 : value)
}