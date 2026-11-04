// Development-only fixtures, not API responses.
export const exercisePreviewDefinitions = [
  { id: "run", name: "달리기", category: "유산소", metrics: ["duration"] },
  {
    id: "squat",
    name: "스쿼트",
    category: "하체",
    metrics: ["weight", "reps"],
  },
  {
    id: "deadlift",
    name: "데드리프트",
    category: "하체",
    metrics: ["weight", "reps", "rest"],
  },
  { id: "lunge", name: "런지", category: "하체", metrics: ["reps"] },
  {
    id: "bench",
    name: "벤치프레스",
    category: "가슴",
    metrics: ["weight", "reps", "rest"],
  },
  { id: "pushup", name: "푸시업", category: "가슴", metrics: ["reps", "rest"] },
  {
    id: "legcurl",
    name: "레그 컬",
    category: "하체",
    metrics: ["weight", "reps", "duration"],
    isCustom: true,
  },
];

export const exercisePreviewRecords = [
  {
    ...exercisePreviewDefinitions[0],
    id: "record-run",
    exerciseId: "run",
    duration: "00:50:30",
    sets: [],
  },
  {
    ...exercisePreviewDefinitions[4],
    id: "record-bench",
    exerciseId: "bench",
    sets: [
      { weight: "50", reps: "15", rest: "30" },
      { weight: "50", reps: "15", rest: "30" },
      { weight: "50", reps: "15", rest: "30" },
    ],
  },
  {
    ...exercisePreviewDefinitions[3],
    id: "record-lunge",
    exerciseId: "lunge",
    sets: [{ reps: "15" }],
  },
];
