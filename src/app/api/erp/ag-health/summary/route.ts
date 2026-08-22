import { NextResponse } from "next/server";

import { getAGHealthDashboardData } from "@/server/business-central/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAGHealthDashboardData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
