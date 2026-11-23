// Profile draft dates use ISO strings so API adapters can replace the local store.
export function dateInputValue(value = "") {
  return value.replace(/-/g, ".");
}

export function normalizeProfileDate(value = "") {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)]
    .filter(Boolean)
    .join("-");
}

export function isProfileDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return year >= 1900 && date.getFullYear() === year &&
    date.getMonth() === month - 1 && date.getDate() === day;
}

// Compare calendar dates in the device's local timezone, without UTC conversion.
export function profileToday(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function isCareerPeriodValid(startDate, endDate, today = profileToday()) {
  return isProfileDate(startDate) && startDate < today &&
    (!endDate || (isProfileDate(endDate) && endDate <= today && startDate <= endDate));
}

export function formatCareerEndDate(endDate, today = profileToday()) {
  return !endDate || endDate === today ? "현재" : endDate.slice(0, 7).replace("-", ".");
}
