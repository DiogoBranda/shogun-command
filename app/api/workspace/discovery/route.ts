import { NextResponse } from "next/server";
import { discoverWorkspace } from "@/features/operations/workspace-discovery/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(discoverWorkspace());
}
