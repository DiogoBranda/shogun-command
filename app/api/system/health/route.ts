import { NextResponse } from "next/server";
import { getSystemHealth } from "@/features/operations/system-health/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSystemHealth());
}
