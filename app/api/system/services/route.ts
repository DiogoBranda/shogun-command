import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { getServices } from "@/lib/system";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    services: await getServices(getConfig().serviceNames),
    checkedAt: new Date().toISOString()
  });
}
