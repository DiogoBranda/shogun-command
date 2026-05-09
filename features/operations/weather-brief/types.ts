export type WeatherLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type WeatherBriefLocation = {
  id: string;
  name: string;
  condition: string;
  weatherCode: number;
  temperatureMaxC: number;
  temperatureMinC: number;
  precipitationProbabilityMaxPercent: number | null;
  precipitationSumMm: number;
  windSpeedMaxKmh: number;
  windGustsMaxKmh: number | null;
  sunrise: string;
  sunset: string;
  summary: string;
};

export type WeatherBrief = {
  agentId: "cloudmancer";
  agentName: "Cloudmancer";
  generatedAt: string;
  forecastDate: string;
  timezone: "Europe/Lisbon";
  source: "Open-Meteo";
  sourceUrl: string;
  locations: WeatherBriefLocation[];
};

export type WeatherBriefResponse = {
  brief: WeatherBrief | null;
  checkedAt: string;
  error?: string;
};
