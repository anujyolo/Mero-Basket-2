import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      application: "Mero Basket Factory Operations",
      phase: "erp-dashboard-foundation",
      dataConnection: "not-configured",
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
