"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_EVERY_MS = 5 * 60 * 1000;

export function AutoErpRefresh() {
  const router = useRouter();

  useEffect(() => {
    async function refreshErpData() {
      if (document.visibilityState === "hidden") {
        return;
      }

      try {
        await fetch("/api/erp/ag-health/summary", { cache: "no-store" });
        router.refresh();
      } catch {
        // Keep the page usable if one ERP refresh fails. The next 5-minute cycle will retry.
      }
    }

    const interval = window.setInterval(() => {
      void refreshErpData();
    }, REFRESH_EVERY_MS);

    return () => window.clearInterval(interval);
  }, [router]);

  return null;
}
