import { getBusinessCentralAuthHeader, getBusinessCentralConfig } from "./config";

export type BusinessCentralStatus = {
  webUrl: string;
  company: string;
  webReachable: boolean;
  serviceConfigured: boolean;
  serviceReachable: boolean | null;
  serviceStatusCode: number | null;
  hasCredentials: boolean;
  status: "ready-for-service-url" | "ready-to-query" | "needs-credentials" | "authentication-rejected" | "unreachable";
  message: string;
};

async function checkUrl(url: string, headers?: HeadersInit) {
  try {
    const testUrl = new URL(url);

    if (!testUrl.searchParams.has("$top")) {
      testUrl.searchParams.set("$top", "1");
    }

    const response = await fetch(testUrl, {
      cache: "no-store",
      headers,
      redirect: "manual",
    });

    return {
      reachable: response.status < 500,
      statusCode: response.status,
    };
  } catch {
    return {
      reachable: false,
      statusCode: null,
    };
  }
}

export async function getBusinessCentralStatus(): Promise<BusinessCentralStatus> {
  const config = getBusinessCentralConfig();
  const authHeader = getBusinessCentralAuthHeader();
  const webCheck = await checkUrl(config.webUrl);
  const serviceConfigured = Boolean(config.serviceBaseUrl);
  const serviceCheck = config.serviceBaseUrl
    ? await checkUrl(config.serviceBaseUrl, authHeader ? { Authorization: authHeader } : undefined)
    : { reachable: null, statusCode: null };
  const webReachable = webCheck.reachable;
  const serviceReachable = serviceCheck.statusCode !== null && serviceCheck.statusCode >= 200 && serviceCheck.statusCode < 300;

  if (!webReachable) {
    return {
      webUrl: config.webUrl,
      company: config.company,
      webReachable,
      serviceConfigured,
      serviceReachable,
      serviceStatusCode: serviceCheck.statusCode,
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
      serviceStatusCode: serviceCheck.statusCode,
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
      serviceStatusCode: serviceCheck.statusCode,
      hasCredentials: config.hasCredentials,
      status: "ready-for-service-url",
      message: "Credentials are configured. Add the Business Central API or OData base URL to begin live data queries.",
    };
  }

  if (serviceCheck.statusCode === 401) {
    return {
      webUrl: config.webUrl,
      company: config.company,
      webReachable,
      serviceConfigured,
      serviceReachable,
      serviceStatusCode: serviceCheck.statusCode,
      hasCredentials: config.hasCredentials,
      status: "authentication-rejected",
      message: "Business Central OData is reachable, but it rejected the configured credentials.",
    };
  }

  return {
    webUrl: config.webUrl,
    company: config.company,
    webReachable,
    serviceConfigured,
    serviceReachable,
    serviceStatusCode: serviceCheck.statusCode,
    hasCredentials: config.hasCredentials,
    status: serviceReachable ? "ready-to-query" : "unreachable",
    message: serviceReachable
      ? "Business Central service is reachable and ready for mapped dashboard queries."
      : "Business Central service URL is configured but could not be reached.",
  };
}
