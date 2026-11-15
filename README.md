# SkyCast — Weather Forecast App

A responsive React + Vite weather app. Search for cities around the world and view current conditions plus 5-, 10- or 14-day forecasts.

## Features
- Worldwide city search with autocomplete suggestions
- Current weather, feels-like temperature, humidity and wind
- 5, 10 or 14-day forecast
- Celsius / Fahrenheit toggle
- Daily high/low, rain probability, wind and UV index
- Responsive layout with loading and error states

## Weather data
This project uses [Open-Meteo](https://open-meteo.com/), including its free geocoding and forecast APIs. No API key is required. Forecast availability depends on the API and location; the app requests up to 14 days.

## Run locally
1. Install Node.js (18+ recommended).
2. Extract this ZIP and open the project folder in a terminal.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL printed by Vite (usually http://localhost:5173).

## Deploy to GitHub and Vercel
1. Create a new repository on GitHub.
2. Upload/push all files from this folder to the repository.
3. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
4. Import your GitHub repository.
5. Vercel should detect **Vite** automatically. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
6. Select **Deploy**. No environment variables are required.

The included `vercel.json` supports client-side routing if routes are added later.

## Project structure
```text
weather-forecast-app/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── api.js
│   ├── weather.js
│   └── styles.css
└── README.md
```

## Notes
- Search uses Open-Meteo's geocoding API.
- Forecast data is fetched from Open-Meteo's forecast API.
- The app requests 14 forecast days and lets users display 5, 10 or 14 days.
- Weather data and forecast availability can vary by location.
