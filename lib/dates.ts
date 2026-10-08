export const TIME_ZONE = "Asia/Kuala_Lumpur";
const UTC_OFFSET = "+08:00";

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const longDateFormat = new Intl.DateTimeFormat("en-MY", {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const shortDateFormat = new Intl.DateTimeFormat("en-MY", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormat = new Intl.DateTimeFormat("en-MY", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const monthFormat = new Intl.DateTimeFormat("en-MY", {
  timeZone: "UTC",
  month: "long",
  year: "numeric",
});

export type MonthKey = { year: number; month: number };

/** "YYYY-MM-DD" for the Kuala Lumpur calendar day of an instant. */
export function dayKey(value: string | Date) {
  return dayKeyFormat.format(new Date(value));
}

export function formatLongDate(value: string) {
  return longDateFormat.format(new Date(value));
}

export function formatShortDate(value: string) {
  return shortDateFormat.format(new Date(value));
}

export function formatTime(value: string) {
  return timeFormat.format(new Date(value)).replace(" ", "").toLowerCase();
}

export function formatTimeRange(startsAt: string, endsAt: string | null) {
  const start = formatTime(startsAt);
  return endsAt ? `${start} – ${formatTime(endsAt)}` : start;
}

const localInputFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "YYYY-MM-DDTHH:mm" in Kuala Lumpur time, for datetime-local inputs. */
export function toLocalInput(value: string | null) {
  if (!value) return "";
  const parts = Object.fromEntries(
    localInputFormat
      .formatToParts(new Date(value))
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** Parses a datetime-local value as Kuala Lumpur time; null if invalid. */
export function fromLocalInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00${UTC_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function currentMonth(): MonthKey {
  const [year, month] = dayKey(new Date()).split("-").map(Number);
  return { year, month };
}

export function parseMonth(value: string | string[] | undefined): MonthKey {
  const raw = Array.isArray(value) ? value[0] : value;
  const match = raw?.match(/^(\d{4})-(\d{2})$/);
  if (!match) return currentMonth();
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12 || year < 2000 || year > 2100) {
    return currentMonth();
  }
  return { year, month };
}

export function monthParam({ year, month }: MonthKey) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function shiftMonth({ year, month }: MonthKey, delta: number): MonthKey {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function monthLabel({ year, month }: MonthKey) {
  return monthFormat.format(new Date(Date.UTC(year, month - 1, 1)));
}

/** UTC instants bounding a Kuala Lumpur calendar month. */
export function monthRange(key: MonthKey) {
  const next = shiftMonth(key, 1);
  return {
    start: new Date(
      `${monthParam(key)}-01T00:00:00${UTC_OFFSET}`,
    ).toISOString(),
    end: new Date(`${monthParam(next)}-01T00:00:00${UTC_OFFSET}`).toISOString(),
  };
}

/** Day keys for a Monday-first grid covering the month, padded with nulls. */
export function monthGrid({ year, month }: MonthKey) {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstWeekday =
    (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array.from(
    { length: firstWeekday },
    () => null,
  );
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(
      `${monthParam({ year, month })}-${String(day).padStart(2, "0")}`,
    );
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
