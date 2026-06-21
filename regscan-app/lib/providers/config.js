// Central provider configuration. All secrets are read from server-side env vars
// (process.env) and MUST NOT be imported into any "use client" file — that would
// bundle them into the browser. These modules are server-only.

export const dvsaMotConfig = {
  clientId: process.env.DVSA_MOT_CLIENT_ID,
  clientSecret: process.env.DVSA_MOT_CLIENT_SECRET,
  apiKey: process.env.DVSA_MOT_API_KEY,
  tokenUrl: process.env.DVSA_MOT_TOKEN_URL, // e.g. https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token
  scope: process.env.DVSA_MOT_SCOPE || "https://tapi.dvsa.gov.uk/.default",
  baseUrl:
    process.env.DVSA_MOT_BASE_URL ||
    "https://history.mot.api.gov.uk/v1/trade/vehicles/registration",
};

export const dvlaVesConfig = {
  apiKey: process.env.DVLA_VES_API_KEY,
  baseUrl:
    process.env.DVLA_VES_BASE_URL ||
    "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
};

export const tflConfig = {
  appKey: process.env.TFL_APP_KEY,
  baseUrl: process.env.TFL_BASE_URL || "https://api.tfl.gov.uk",
};

export const isTflConfigured = () => Boolean(tflConfig.appKey);

export const isDvsaMotConfigured = () =>
  Boolean(
    dvsaMotConfig.clientId &&
      dvsaMotConfig.clientSecret &&
      dvsaMotConfig.apiKey &&
      dvsaMotConfig.tokenUrl
  );

export const isDvlaVesConfigured = () => Boolean(dvlaVesConfig.apiKey);
