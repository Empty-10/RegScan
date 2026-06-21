// Feature flags.
//
// REMINDERS_ENABLED gates the email/SMS MOT/tax reminder feature and every mention
// of it across the UI. It is OFF until the company is ICO-registered, because the
// feature collects personal data (email addresses / phone numbers).
//
// To re-enable the whole feature once registered: set this to true.
export const REMINDERS_ENABLED = false;
