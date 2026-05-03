import { NextResponse } from "next/server";
import { getTeam } from "@/lib/team";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTeam());
}
