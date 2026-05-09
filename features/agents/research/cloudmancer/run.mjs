import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export const cloudmancerAgent = {
  id: "cloudmancer",
  name: "Cloudmancer",
  sourceUrl: "https://open-meteo.com/en/docs",
  timezone: "Europe/Lisbon"
};

const dailyFields = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "sunrise",
  "sunset"
];

const weatherCodes = new Map([
  [0, "Clear sky"],
  [1, "Mainly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [48, "Depositing rime fog"],
  [51, "Light drizzle"],
  [53, "Moderate drizzle"],
  [55, "Dense drizzle"],
  [56, "Light freezing drizzle"],
  [57, "Dense freezing drizzle"],
  [61, "Slight rain"],
  [63, "Moderate rain"],
  [65, "Heavy rain"],
  [66, "Light freezing rain"],
  [67, "Heavy freezing rain"],
  [71, "Slight snow"],
  [73, "Moderate snow"],
  [75, "Heavy snow"],
  [77, "Snow grains"],
  [80, "Slight rain showers"],
  [81, "Moderate rain showers"],
  [82, "Violent rain showers"],
  [85, "Slight snow showers"],
  [86, "Heavy snow showers"],
  [95, "Thunderstorm"],
  [96, "Thunderstorm with slight hail"],
  [99, "Thunderstorm with heavy hail"]
]);

function numberAt(values, index, fallback = 0) {
  const value = Array.isArray(values) ? Number(values[index]) : Number.NaN;
  return Number.isFinite(value) ? value : fallback;
}

function nullableNumberAt(values, index) {
  const value = Array.isArray(values) ? Number(values[index]) : Number.NaN;
  return Number.isFinite(value) ? value : null;
}

function stringAt(values, index) {
  const value = Array.isArray(values) ? values[index] : null;
  return typeof value === "string" ? value : "";
}

function formatNumber(value, suffix) {
  return `${new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(value)}${suffix}`;
}

function buildSummary({ condition, temperatureMinC, temperatureMaxC, precipitationProbabilityMaxPercent, precipitationSumMm, windSpeedMaxKmh }) {
  const rainChance =
    precipitationProbabilityMaxPercent === null ? "unknown rain chance" : `${precipitationProbabilityMaxPercent}% rain chance`;

  return `${condition}. ${formatNumber(temperatureMinC, "C")} to ${formatNumber(temperatureMaxC, "C")}, ${rainChance}, ${formatNumber(precipitationSumMm, " mm")} rain, wind up to ${formatNumber(windSpeedMaxKmh, " km/h")}.`;
}

async function fetchForecast(location) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set("daily", dailyFields.join(","));
  url.searchParams.set("timezone", cloudmancerAgent.timezone);
  url.searchParams.set("forecast_days", "1");

  const response = await fetch(url, {
    headers: {
      "user-agent": "shogun-command-cloudmancer/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`${location.name} forecast failed with HTTP ${response.status}`);
  }

  const payload = await response.json();
  const daily = payload?.daily;
  if (!daily || !Array.isArray(daily.time) || !daily.time[0]) {
    throw new Error(`${location.name} forecast response did not include daily data`);
  }

  const weatherCode = numberAt(daily.weather_code, 0);
  const entry = {
    id: location.id,
    name: location.name,
    condition: weatherCodes.get(weatherCode) ?? `Weather code ${weatherCode}`,
    weatherCode,
    temperatureMaxC: numberAt(daily.temperature_2m_max, 0),
    temperatureMinC: numberAt(daily.temperature_2m_min, 0),
    precipitationProbabilityMaxPercent: nullableNumberAt(daily.precipitation_probability_max, 0),
    precipitationSumMm: numberAt(daily.precipitation_sum, 0),
    windSpeedMaxKmh: numberAt(daily.wind_speed_10m_max, 0),
    windGustsMaxKmh: nullableNumberAt(daily.wind_gusts_10m_max, 0),
    sunrise: stringAt(daily.sunrise, 0),
    sunset: stringAt(daily.sunset, 0)
  };

  return { ...entry, summary: buildSummary(entry), forecastDate: String(daily.time[0]) };
}

export async function createCloudmancerBrief({ rootDir }) {
  const locationsPath = join(rootDir, "features", "agents", "research", "cloudmancer", "locations.json");
  const locations = JSON.parse(await readFile(locationsPath, "utf8"));
  if (!Array.isArray(locations) || locations.length === 0) {
    throw new Error("No Cloudmancer weather locations configured");
  }

  const forecasts = await Promise.all(locations.map(fetchForecast));

  return {
    agentId: cloudmancerAgent.id,
    agentName: cloudmancerAgent.name,
    generatedAt: new Date().toISOString(),
    forecastDate: forecasts[0]?.forecastDate,
    timezone: cloudmancerAgent.timezone,
    source: "Open-Meteo",
    sourceUrl: cloudmancerAgent.sourceUrl,
    locations: forecasts.map(({ forecastDate: _forecastDate, ...forecast }) => forecast)
  };
}

export async function runCloudmancer({ rootDir, outputPath = join(rootDir, "data", "weather-brief.local.json") }) {
  const brief = await createCloudmancerBrief({ rootDir });

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(brief, null, 2)}\n`, { flag: "w" });
  console.log(`${cloudmancerAgent.name} wrote weather brief to ${outputPath}`);
}
