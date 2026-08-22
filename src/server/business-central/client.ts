import { getBusinessCentralAuthHeader, getBusinessCentralConfig } from "./config";

export type BusinessCentralStatus = {
  webUrl: string;
  company: string;
  webReachable: boolean;
  serviceConfigured: boolean;
  serviceReachable: boolean | null;
  hasCredentials: boolean;
  status: "ready-for-service-url" | "ready-to-query" | "needs-credentials" | "unreachable";
  message: string;
};

async function canReach(url: string, headers?: HeadersInit) {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers,
      redirect: "manual",
    });

    return response.status < 500;
  } catch {
    return false;
  }
}

export async function getBusinessCentralStatus(): Promise<BusinessCentralStatus> {
  const config = getBusinessCentralConfig();
  const authHeader = getBusinessCentralAuthHeader();
  const webReachable = await canReach(config.webUrl);
  const serviceConfigured = Boolean(config.serviceBaseUrl);
  const serviceReachable = config.serviceBaseUrl
    ? await canReach(config.serviceBaseUrl, authHeader ? { Authorization: authHeader } : undefined)
    : null;

  if (!webReachable) {
    return {
      webUrl: config.webUrl,
      company: config.company,
      webReachable,
      serviceConfigured,
      serviceReachable,
      hasCredentials: config.hasCredentials,
      status: "unreachable",
      message: "The ERP web address could not be reached from this app.",
    };
  }

  if (!config.hasCredentials) {
    return {
      webUrl: config.webUrl,
      company: config.company,
      webReachable,
      serviceConfigured,
      serviceReachable,
      hasCredentials: config.hasCredentials,
      status: "needs-credentials",
      message: "The ERP web address is reachable. Add local credentials to enable authenticated data checks.",
    };
  }

  if (!serviceConfigured) {
    return {
      webUrl: config.webUrl,
      company: config.company,
      webReachable,
      serviceConfigured,
      serviceReachable,
      hasCredentials: config.hasCredentials,
      status: "ready-for-service-url",
      message: "Credentials are configured. Add the Business Central API or OData base URL to begin live data queries.",
    };
  }

  return {
    webUrl: config.webUrl,
    company: config.company,
    webReachable,
    serviceConfigured,
    serviceReachable,
    hasCredentials: config.hasCredentials,
    status: serviceReachable ? "ready-to-query" : "unreachable",
    message: serviceReachable
      ? "Business Central service is reachable and ready for mapped dashboard queries."
      : "Business Central service URL is configured but could not be reached.",
  };
}
