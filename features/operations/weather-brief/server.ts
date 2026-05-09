import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { e2eWeatherBrief, useE2eFixtures } from "@/features/testing/e2e-fixtures";
import type { WeatherBrief, WeatherBriefResponse } from "./types";

export const weatherBriefPath = join(process.cwd(), "data", "weather-brief.local.json");

function isLocation(value: unknown): value is WeatherBrief["locations"][number] {
  if (!value || typeof value !== "object") return false;
  const location = value as Record<string, unknown>;
  return (
    typeof location.id === "string" &&
    typeof location.name === "string" &&
    typeof location.condition === "string" &&
    typeof location.weatherCode === "number" &&
    typeof location.temperatureMaxC === "number" &&
    typeof location.temperatureMinC === "number" &&
    (typeof location.precipitationProbabilityMaxPercent === "number" || location.precipitationProbabilityMaxPercent === null) &&
    typeof location.precipitationSumMm === "number" &&
    typeof location.windSpeedMaxKmh === "number" &&
    (typeof location.windGustsMaxKmh === "number" || location.windGustsMaxKmh === null) &&
    typeof location.sunrise === "string" &&
    typeof location.sunset === "string" &&
    typeof location.summary === "string"
  );
}

function isWeatherBrief(value: unknown): value is WeatherBrief {
  if (!value || typeof value !== "object") return false;
  const brief = value as Record<string, unknown>;
  return (
    typeof brief.generatedAt === "string" &&
    brief.agentId === "cloudmancer" &&
    brief.agentName === "Cloudmancer" &&
    typeof brief.forecastDate === "string" &&
    brief.timezone === "Europe/Lisbon" &&
    brief.source === "Open-Meteo" &&
    typeof brief.sourceUrl === "string" &&
    Array.isArray(brief.locations) &&
    brief.locations.every(isLocation)
  );
}

export function getWeatherBrief(): WeatherBriefResponse {
  const checkedAt = new Date().toISOString();

  if (useE2eFixtures()) {
    return { brief: e2eWeatherBrief, checkedAt };
  }

  try {
    if (!existsSync(weatherBriefPath)) {
      return { brief: null, checkedAt, error: `Weather brief not found at ${weatherBriefPath}` };
    }

    const parsed: unknown = JSON.parse(readFileSync(weatherBriefPath, "utf8"));
    if (!isWeatherBrief(parsed)) {
      return { brief: null, checkedAt, error: "Weather brief file has an unexpected shape" };
    }

    return { brief: parsed, checkedAt };
  } catch (error) {
    return {
      brief: null,
      checkedAt,
      error: error instanceof Error ? error.message : "Unable to read weather brief"
    };
  }
}
