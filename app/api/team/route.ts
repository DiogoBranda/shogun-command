import { NextResponse } from "next/server";
import { getTeam } from "@/features/command/team-roster/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTeam());
}
