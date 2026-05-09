import { NextResponse } from "next/server";
import { getWeatherBrief } from "@/features/operations/weather-brief/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getWeatherBrief());
}
