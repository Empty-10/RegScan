import { NextResponse } from "next/server";
import { providerStatus } from "@/lib/providers";

// GET /api/providers -> which integrations are configured. Reports booleans only,
// never the secret values themselves.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ providers: providerStatus() });
}
