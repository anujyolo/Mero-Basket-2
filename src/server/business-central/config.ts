const DEFAULT_WEB_URL = "https://erp.agilenepal.com:10443/AgHealth/?company=AG%20Health%20Live&dc=0&signInRedirected=1";
const DEFAULT_COMPANY = "AG Health Live";

export type BusinessCentralConfig = {
  webUrl: string;
  company: string;
  serviceBaseUrl: string | null;
  companyODataUrl: string | null;
  hasCredentials: boolean;
};

function getCompanyODataUrl(serviceBaseUrl: string | null) {
  if (!serviceBaseUrl) {
    return null;
  }

  try {
    const url = new URL(serviceBaseUrl);
    url.search = "";
    url.pathname = url.pathname.replace(/\/[^/]+\/?$/, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getBusinessCentralConfig(): BusinessCentralConfig {
  const serviceBaseUrl = process.env.BUSINESS_CENTRAL_SERVICE_BASE_URL?.trim() || null;

  return {
    webUrl: process.env.BUSINESS_CENTRAL_WEB_URL?.trim() || DEFAULT_WEB_URL,
    company: process.env.BUSINESS_CENTRAL_COMPANY?.trim() || DEFAULT_COMPANY,
    serviceBaseUrl,
    companyODataUrl: getCompanyODataUrl(serviceBaseUrl),
    hasCredentials: Boolean(process.env.BUSINESS_CENTRAL_USERNAME && process.env.BUSINESS_CENTRAL_PASSWORD),
  };
}

export function getBusinessCentralAuthHeader() {
  const username = process.env.BUSINESS_CENTRAL_USERNAME;
  const password = process.env.BUSINESS_CENTRAL_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}
