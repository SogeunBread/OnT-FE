export const MEAL_TIME_COLUMNS = [
  { unit: "hour", title: "시", count: 24 },
  { unit: "minute", title: "분", count: 60 },
].map(({ count, ...column }) => ({
  ...column,
  options: Array.from({ length: count }, (_, value) => ({
    value,
    label: String(value).padStart(2, "0"),
  })),
}));
