import { NextResponse } from "next/server";

import { getBusinessCentralStatus } from "@/server/business-central/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const erp = await getBusinessCentralStatus();

  return NextResponse.json(
    {
      ...erp,
      credentials: erp.hasCredentials ? "configured" : "missing",
      hasCredentials: undefined,
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
