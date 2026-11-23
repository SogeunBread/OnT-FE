import { format, subDays } from "date-fns";
import { cloneExerciseRecords } from "../../components/exercise/exerciseModel.js";

// Development seed only. No API/authentication or persistent storage is implied.
export function createExerciseSeed(now = new Date()) {
  const today = format(now, "yyyy-MM-dd");
  const yesterday = format(subDays(now, 1), "yyyy-MM-dd");
  const exercises = [
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
    {
      id: "pushup",
      name: "푸시업",
      category: "가슴",
      metrics: ["reps", "rest"],
    },
    { id: "cycle", name: "사이클", category: "유산소", metrics: ["duration"] },
    {
      id: "stairs",
      name: "천국의 계단",
      category: "유산소",
      metrics: ["duration"],
    },
    {
      id: "legcurl",
      name: "레그 컬",
      category: "하체",
      metrics: ["weight", "reps", "duration"],
      isCustom: true,
    },
  ];
  const records = [
    {
      ...exercises[0],
      id: "seed-record-run",
      exerciseId: "run",
      duration: "00:50:30",
      sets: [],
    },
    {
      ...exercises[4],
      id: "seed-record-bench",
      exerciseId: "bench",
      sets: Array.from({ length: 3 }, () => ({
        weight: "50",
        reps: "15",
        rest: "30",
      })),
    },
    {
      ...exercises[2],
      id: "seed-record-deadlift",
      exerciseId: "deadlift",
      sets: Array.from({ length: 4 }, () => ({
        weight: "50",
        reps: "15",
        rest: "30",
      })),
    },
  ];
  return {
    selectedDate: today,
    exercises,
    journals: [
      {
        id: "journal-today",
        title: "내일 계단은 쉬는 하체 운동",
        date: today,
        startTime: "12:00",
        endTime: "14:00",
        records: cloneExerciseRecords(records),
        memo: "오늘 운동에 대한 느낌과 컨디션을 기록해보세요.",
      },
      {
        id: "journal-yesterday",
        title: "어제의 운동",
        date: yesterday,
        startTime: "11:30",
        endTime: "12:30",
        records: cloneExerciseRecords(records.slice(0, 1)),
        memo: "",
      },
    ],
    sessions: [
      {
        id: "pt-today",
        trainerName: "홍길동 트레이너님",
        date: today,
        startTime: "15:00",
        endTime: "16:00",
        location: "다짐 헬스장",
        sessionNumber: 4,
        totalSessions: 10,
        records: cloneExerciseRecords(records),
        memo: "",
        memberConfirmed: false,
        trainerConfirmed: false,
        status: "scheduled",
      },
      {
        id: "pt-yesterday",
        trainerName: "홍길동 트레이너님",
        date: yesterday,
        startTime: "15:00",
        endTime: "16:00",
        location: "다짐 헬스장",
        sessionNumber: 3,
        totalSessions: 10,
        records: cloneExerciseRecords(records),
        memo: "",
        memberConfirmed: false,
        trainerConfirmed: true,
        status: "completed",
      },
    ],
    routines: [
      {
        id: "routine-trainer",
        name: "하체 강하게",
        trainerAssigned: true,
        records: cloneExerciseRecords(records),
      },
      {
        id: "routine-personal",
        name: "출근하기 전",
        trainerAssigned: false,
        records: cloneExerciseRecords(records.slice(0, 2)),
      },
    ],
  };
}
