import { isAfter, isValid, parseISO, startOfDay } from "date-fns";

export function canRecordMealOnDate(value, today = new Date()) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) && !isAfter(startOfDay(date), startOfDay(today));
}
