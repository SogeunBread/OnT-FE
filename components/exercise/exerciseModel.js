/**
 * Exercise definition: { id, name, category, metrics, isCustom? }
 * Exercise record: { id (row identity), exerciseId, name, category, metrics,
 *   sets: [{ weight?, reps?, duration?, rest? }], duration? (HH:MM:SS) }
 * Values remain strings while editing. A record snapshots the definition so
 * later catalogue edits/deletions do not change an existing journal or routine.
 */
export const EXERCISE_CATEGORIES = [
  "하체",
  "등",
  "가슴",
  "어깨",
  "팔",
  "복근",
  "유산소",
];
export const EXERCISE_METRICS = [
  { id: "weight", label: "무게", inputLabel: "무게(kg)", unit: "kg" },
  { id: "reps", label: "횟수", inputLabel: "횟수", unit: "회" },
  { id: "duration", label: "시간", inputLabel: "시간(초)", unit: "초" },
  { id: "rest", label: "휴식 시간", inputLabel: "휴식(초)", unit: "초" },
];
export const ROUTINE_LIMIT = 5;
export const metricInfo = (id) =>
  EXERCISE_METRICS.find((item) => item.id === id);
export const isTimeOnly = (record) =>
  record.metrics?.length === 1 && record.metrics[0] === "duration";
export const cloneExerciseRecords = (records) =>
  records.map((record) => ({
    ...record,
    metrics: [...(record.metrics ?? [])],
    sets: (record.sets ?? []).map((set) => ({ ...set })),
  }));

let nextRecordId = 0;
export function createExerciseRecord(exercise) {
  return {
    id: `exercise-record-${Date.now()}-${++nextRecordId}`,
    exerciseId: exercise.id,
    name: exercise.name,
    category: exercise.category,
    metrics: [...exercise.metrics],
    sets: isTimeOnly(exercise)
      ? []
      : [Object.fromEntries(exercise.metrics.map((id) => [id, "0"]))],
    ...(isTimeOnly(exercise) && { duration: "00:00:00" }),
  };
}

export function formatExerciseDuration(value) {
  if (value === undefined || value === null || value === "") return "";
  const parts = String(value).split(":");
  if (parts.length !== 3 || !parts.every((part) => /^\d+$/.test(part)))
    return String(value);
  const [hours, minutes, seconds] = parts.map(Number);
  return `${hours ? `${hours}시간 ` : ""}${minutes}분 ${seconds}초`;
}

export function isValidExerciseDuration(value) {
  return /^\d{2,}:[0-5]\d:[0-5]\d$/.test(value);
}

export function validateCustomExercise({ name = "", category, metrics = [] }) {
  if (!name.trim()) return "운동 이름을 입력해주세요.";
  if (!EXERCISE_CATEGORIES.includes(category))
    return "카테고리를 선택해주세요.";
  if (
    metrics.length < 1 ||
    metrics.length > 3 ||
    new Set(metrics).size !== metrics.length ||
    metrics.some((id) => !metricInfo(id))
  ) {
    return "타입을 1개 이상 3개 이하로 선택해주세요.";
  }
  return null;
}
