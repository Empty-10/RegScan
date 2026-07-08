// Feature flags.
//
// REMINDERS_ENABLED gates the email/SMS MOT/tax reminder feature and every mention
// of it across the UI. It is OFF until the company is ICO-registered, because the
// feature collects personal data (email addresses / phone numbers).
//
// To re-enable the whole feature once registered: set this to true.
export const REMINDERS_ENABLED = false;

// GARAGE_ENABLED gates the "My Garage" / save-vehicles feature (and the account
// sign-up/log-in that backs it). OFF until the feature is built. Flip to true to
// restore the garage nav, "Save to garage" action and the /garage page.
export const GARAGE_ENABLED = false;
