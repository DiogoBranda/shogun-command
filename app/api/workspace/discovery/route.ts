import { NextResponse } from "next/server";
import { discoverWorkspace } from "@/lib/workspace";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(discoverWorkspace());
}
