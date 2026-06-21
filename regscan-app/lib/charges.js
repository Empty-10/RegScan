// London road-charge schedules — pure date logic, no API needed.
// Charging hours are fixed published schedules, so "is it active right now" is a
// time calculation in Europe/London. Safe to run on the client.

// Returns {weekday: "Mon".."Sun", minutes: 0..1439} for `date` in London time.
function londonNow(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return {
    weekday: get("weekday"),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function chargeStatusNow(date = new Date()) {
  const { weekday, minutes } = londonNow(date);
  const isWeekend = weekday === "Sat" || weekday === "Sun";

  // Congestion Charge: Mon–Fri 07:00–18:00, Sat/Sun 12:00–18:00.
  const ccStart = isWeekend ? 12 * 60 : 7 * 60;
  const ccEnd = 18 * 60;
  const congestionActive = minutes >= ccStart && minutes < ccEnd;

  return {
    congestion: {
      active: congestionActive,
      note: congestionActive
        ? "Congestion Charge active now · £15/day"
        : `Congestion Charge not active now (${isWeekend ? "12:00" : "07:00"}–18:00)`,
    },
    // ULEZ operates 24 hours, every day except Christmas Day.
    ulez: {
      active: true,
      note: "ULEZ operates 24/7 (except Christmas Day)",
    },
  };
}
