// Provider registry. To add a new data source ("many others"), add an entry here
// with an `isConfigured` check and the env vars it needs. The /api/providers route
// reports this so you can see at a glance which integrations are live.
import "server-only";
import { isDvsaMotConfigured, isDvlaVesConfigured, isTflConfigured } from "./config";

export const providers = [
  {
    id: "dvsa-mot",
    name: "DVSA MOT History",
    purpose: "MOT test history, results and expiry",
    envVars: [
      "DVSA_MOT_CLIENT_ID",
      "DVSA_MOT_CLIENT_SECRET",
      "DVSA_MOT_API_KEY",
      "DVSA_MOT_TOKEN_URL",
    ],
    isConfigured: isDvsaMotConfigured,
  },
  {
    id: "dvla-ves",
    name: "DVLA Vehicle Enquiry Service",
    purpose: "Tax status, make, colour, CO2, emissions",
    envVars: ["DVLA_VES_API_KEY"],
    isConfigured: isDvlaVesConfigured,
  },
  {
    id: "tfl-airquality",
    name: "TfL Unified API",
    purpose: "London air quality forecast",
    envVars: ["TFL_APP_KEY"],
    isConfigured: isTflConfigured,
  },
  // Example template for the next provider — uncomment, implement a fetch module,
  // and add normalization in normalize.js:
  // {
  //   id: "tfl-ulez",
  //   name: "TfL ULEZ",
  //   purpose: "Authoritative ULEZ / congestion charge status",
  //   envVars: ["TFL_APP_KEY"],
  //   isConfigured: () => Boolean(process.env.TFL_APP_KEY),
  // },
];

export function providerStatus() {
  return providers.map((p) => ({
    id: p.id,
    name: p.name,
    purpose: p.purpose,
    configured: p.isConfigured(),
    envVars: p.envVars,
  }));
}
