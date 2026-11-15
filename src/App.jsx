import { useEffect, useRef, useState } from 'react'
import {
  Search, MapPin, Wind, Droplets, Sun, Sunrise, Sunset, Gauge,
  CloudSun, CalendarDays, ChevronDown, LoaderCircle, AlertCircle,
  Thermometer, CloudRain
} from 'lucide-react'
import { getForecast, searchCities } from './api'
import { convertTemp, formatDate, formatDay, weatherInfo } from './weather'

function App() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [weather, setWeather] = useState(null)
  const [days, setDays] = useState(10)
  const [unit, setUnit] = useState('C')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchCities(query.trim())
        setSuggestions(results)
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  async function chooseCity(city) {
    setSelectedCity(city)
    setQuery(city.name)
    setSuggestions([])
    setShowSuggestions(false)
    setLoading(true)
    setError('')
    try {
      const result = await getForecast(city)
      setWeather(result)
    } catch (err) {
      setWeather(null)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function submitSearch(event) {
    event.preventDefault()
    if (suggestions.length) chooseCity(suggestions[0])
    else if (query.trim().length >= 2) {
      setError('Choose a city from the suggestions to load its forecast.')
      setShowSuggestions(true)
    }
  }

  const current = weather?.current
  const daily = weather?.daily
  const todayInfo = current ? weatherInfo(current.weather_code) : null
  const shownDays = daily ? daily.time.slice(0, days) : []

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="SkyCast home">
          <span className="brand-mark"><CloudSun size={22} /></span>
          <span>skycast<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-note"><span className="live-dot" /> Live weather insights</div>
      </header>

      <section className="hero">
        <div className="eyebrow"><span /> YOUR WEATHER, AHEAD OF TIME</div>
        <h1>Plan your days<br /><span>under any sky.</span></h1>
        <p className="hero-copy">Explore current conditions and the forecast for the days ahead, wherever you are going.</p>

        <div className="search-wrap" ref={searchRef}>
          <form className="search-form" onSubmit={submitSearch}>
            <MapPin className="search-pin" size={20} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setError('') }}
              onFocus={() => suggestions.length && setShowSuggestions(true)}
              placeholder="Search a city — e.g. Bengaluru, Tokyo..."
              aria-label="Search city"
            />
            {searching && <LoaderCircle className="spin search-spinner" size={19} />}
            <button type="submit" className="search-button"><Search size={18} /><span>Search</span></button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((city) => (
                <button key={`${city.id}-${city.latitude}`} onClick={() => chooseCity(city)} className="suggestion">
                  <span className="suggestion-icon"><MapPin size={17} /></span>
                  <span className="suggestion-name">{city.name}<small>{[city.admin1, city.country].filter(Boolean).join(', ')}</small></span>
                  <span className="suggestion-arrow">↗</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {error && <div className="error-message"><AlertCircle size={16} />{error}</div>}
        <div className="search-hint">Try a city anywhere in the world</div>
      </section>

      {loading && (
        <section className="loading-panel"><LoaderCircle className="spin" size={28} /><span>Gathering the latest forecast...</span></section>
      )}

      {!weather && !loading && (
        <section className="empty-state">
          <div className="empty-icon">🌤️</div>
          <h2>A clearer view starts here</h2>
          <p>Search for a city above to see its current weather and extended forecast.</p>
          <div className="empty-chips"><span>🌞 Current conditions</span><span>📅 14-day outlook</span><span>🌧️ Rain chances</span></div>
        </section>
      )}

      {weather && current && daily && !loading && (
        <section className="weather-content">
          <div className="location-heading">
            <div>
              <div className="section-kicker">WEATHER OVERVIEW</div>
              <h2><MapPin size={21} /> {selectedCity?.name}<span>{[selectedCity?.admin1, selectedCity?.country].filter(Boolean).join(', ')}</span></h2>
              <p className="updated-label">Local time · {weather.timezone?.replaceAll('_', ' ')}</p>
            </div>
            <div className="unit-switch" aria-label="Temperature unit">
              <button className={unit === 'C' ? 'active' : ''} onClick={() => setUnit('C')}>°C</button>
              <button className={unit === 'F' ? 'active' : ''} onClick={() => setUnit('F')}>°F</button>
            </div>
          </div>

          <div className="current-grid">
            <article className="current-card">
              <div className="current-top"><span>RIGHT NOW</span><span className="current-date">{formatDate(daily.time[0])}</span></div>
              <div className="current-main">
                <div>
                  <div className="big-temp">{convertTemp(current.temperature_2m, unit)}<sup>°{unit}</sup></div>
                  <div className="condition">{todayInfo.label}</div>
                  <div className="feels-like">Feels like {convertTemp(current.apparent_temperature, unit)}°{unit}</div>
                </div>
                <div className={`weather-illustration ${todayInfo.tone}`}><span>{todayInfo.icon}</span></div>
              </div>
              <div className="high-low">
                <span><Sun size={16} /> H: {convertTemp(daily.temperature_2m_max[0], unit)}°</span>
                <span><CloudSun size={16} /> L: {convertTemp(daily.temperature_2m_min[0], unit)}°</span>
              </div>
            </article>

            <article className="details-card">
              <div className="details-heading">Today's details <span>AT A GLANCE</span></div>
              <div className="details-grid">
                <Detail icon={<Droplets />} label="Humidity" value={`${current.relative_humidity_2m}%`} />
                <Detail icon={<Wind />} label="Wind speed" value={`${Math.round(current.wind_speed_10m)} km/h`} />
                <Detail icon={<CloudRain />} label="Rain chance" value={`${daily.precipitation_probability_max[0] ?? 0}%`} />
                <Detail icon={<Sun />} label="UV index" value={`${Math.round(daily.uv_index_max[0] ?? 0)}`} />
                <Detail icon={<Sunrise />} label="Sunrise" value={daily.sunrise[0]?.slice(11, 16) || '—'} />
                <Detail icon={<Sunset />} label="Sunset" value={daily.sunset[0]?.slice(11, 16) || '—'} />
              </div>
            </article>
          </div>

          <div className="forecast-heading">
            <div><div className="section-kicker">LOOKING AHEAD</div><h2><CalendarDays size={21} /> Daily forecast</h2><p>Stay one step ahead of the weather.</p></div>
            <div className="range-control">
              {[5, 10, 14].map((n) => <button key={n} className={days === n ? 'selected' : ''} onClick={() => setDays(n)}>{n} days</button>)}
            </div>
          </div>

          <div className="forecast-list">
            {shownDays.map((date, index) => {
              const info = weatherInfo(daily.weather_code[index])
              return (
                <article className={`forecast-row ${index === 0 ? 'today-row' : ''}`} key={date}>
                  <div className="forecast-day"><strong>{formatDay(date, index)}</strong><span>{formatDate(date)}</span></div>
                  <div className={`forecast-icon ${info.tone}`}>{info.icon}</div>
                  <div className="forecast-condition">{info.label}</div>
                  <div className="temp-range"><strong>{convertTemp(daily.temperature_2m_max[index], unit)}°</strong><span>{convertTemp(daily.temperature_2m_min[index], unit)}°</span><div className="temp-track"><i style={{ left: `${Math.max(0, Math.min(75, 35 + (daily.temperature_2m_min[index] / 2)))}%`, width: '28%' }} /></div></div>
                  <div className="forecast-extra"><Droplets size={15} /><span>{daily.precipitation_probability_max[index] ?? 0}%</span></div>
                  <div className="forecast-wind"><Wind size={15} /><span>{Math.round(daily.wind_speed_10m_max[index])} km/h</span></div>
                </article>
              )
            })}
          </div>
          <div className="data-credit">Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Forecast values are estimates and may change.</div>
        </section>
      )}

      <footer className="footer"><span>skycast<span className="brand-dot">.</span></span><span>Weather looks better when you're prepared.</span></footer>
    </main>
  )
}

function Detail({ icon, label, value }) {
  return <div className="detail-item"><span className="detail-icon">{icon}</span><span className="detail-copy"><small>{label}</small><strong>{value}</strong></span></div>
}

export default App