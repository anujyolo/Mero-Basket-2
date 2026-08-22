import { NextResponse } from "next/server";

import { getBusinessCentralStatus } from "@/server/business-central/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const erp = await getBusinessCentralStatus();

  return NextResponse.json(
    {
      status: "ok",
      application: "Mero Basket Factory Operations",
      phase: "erp-dashboard-foundation",
      dataConnection: erp.status,
      erp: {
        company: erp.company,
        webReachable: erp.webReachable,
        serviceConfigured: erp.serviceConfigured,
        serviceReachable: erp.serviceReachable,
        serviceStatusCode: erp.serviceStatusCode,
        credentials: erp.hasCredentials ? "configured" : "missing",
      },
      requiredData: [
        "raw-materials",
        "finished-goods",
        "production-entries",
        "orders",
        "notifications",
        "bank-balances",
        "approval-requests",
        "users",
        "audit-logs",
        "rate-limits",
      ],
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
