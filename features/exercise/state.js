import {
  cloneExerciseRecords,
  isTimeOnly,
  isValidExerciseDuration,
  metricInfo,
  ROUTINE_LIMIT,
  validateCustomExercise,
} from "../../components/exercise/exerciseModel.js";

// Completion is explicit; elapsed time and mutual confirmation do not grant edit rights.
export const canEditPTRecord = (session) => session?.status === "completed";
export const emptyExerciseState = {
  ready: false,
  selectedDate: "",
  exercises: [],
  journals: [],
  sessions: [],
  routines: [],
  drafts: {},
  notice: "",
  result: null,
};

export function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    year >= 1900 &&
    year <= 9999 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
export const isValidTime = (value) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value ?? "");
export function normalizeRecords(records) {
  return cloneExerciseRecords(records).map((record) => ({
    ...record,
    ...(isTimeOnly(record) && { duration: record.duration || "00:00:00" }),
    sets: record.sets.map((set) =>
      Object.fromEntries(
        record.metrics.map((id) => [id, String(set[id] ?? "0").trim() || "0"])
      )
    ),
  }));
}
export function validateDraft(draft) {
  if (!draft) return "작성 중인 내용을 찾을 수 없습니다.";
  if (draft.kind !== "pt" && (!draft.title?.trim() || draft.title.length > 20))
    return "제목을 1~20자로 입력해주세요.";
  if (draft.kind === "journal") {
    if (!isValidDateKey(draft.date)) return "올바른 날짜를 선택해주세요.";
    if (!isValidTime(draft.startTime) || !isValidTime(draft.endTime))
      return "올바른 운동 시간을 입력해주세요.";
    if (draft.startTime >= draft.endTime)
      return "종료 시간은 시작 시간보다 늦어야 합니다.";
  }
  if ((draft.memo ?? "").length > 200)
    return "메모는 200자까지 입력할 수 있습니다.";
  if (!draft.records?.length) return "운동을 한 개 이상 추가해주세요.";
  for (const record of draft.records) {
    if (
      !record.name?.trim() ||
      !record.metrics?.length ||
      record.metrics.length > 3 ||
      record.metrics.some((id) => !metricInfo(id))
    )
      return "운동의 기록 항목을 확인해주세요.";
    if (isTimeOnly(record)) {
      if (!isValidExerciseDuration(record.duration || "00:00:00"))
        return `${record.name} 시간을 시:분:초 형식으로 입력해주세요.`;
    } else
      for (const set of record.sets ?? [])
        for (const id of record.metrics) {
          const value = String(set[id] ?? "0").trim() || "0";
          if (
            !(id === "weight" ? /^\d+(\.\d+)?$/ : /^\d+$/).test(value) ||
            !Number.isFinite(Number(value))
          )
            return `${record.name}의 기록값을 확인해주세요.`;
        }
  }
  return null;
}

const outcome = (state, ok, message = "", extra = {}) => ({
  ...state,
  result: { ok, message, ...extra },
});
export function exerciseReducer(state, action) {
  switch (action.type) {
    case "INITIALIZE":
      return state.ready
        ? state
        : { ...emptyExerciseState, ...action.seed, ready: true };
    case "SELECT_DATE":
      return isValidDateKey(action.date)
        ? { ...state, selectedDate: action.date }
        : state;
    case "CLEAR_NOTICE":
      return { ...state, notice: "" };
    case "OPEN_DRAFT": {
      const { id, kind, sourceId, routineId, date } = action;
      if (state.drafts[id])
        return state.drafts[id].kind === kind &&
          (state.drafts[id].sourceId ?? null) === (sourceId ?? null)
          ? outcome(state, true, "", { draftId: id })
          : outcome(state, false, "작성 화면과 초안이 일치하지 않습니다.");
      if (!["journal", "routine", "pt"].includes(kind))
        return outcome(state, false, "지원하지 않는 작성 화면입니다.");
      const source = sourceId
        ? (kind === "routine"
            ? state.routines
            : kind === "pt"
            ? state.sessions
            : state.journals
          ).find((item) => item.id === sourceId)
        : null;
      if (sourceId && !source)
        return outcome(state, false, "기록을 찾을 수 없습니다.");
      if (kind === "pt" && !canEditPTRecord(source))
        return outcome(
          state,
          false,
          "진행 완료된 PT 기록만 수정할 수 있습니다."
        );
      if (kind === "routine" && source?.trainerAssigned)
        return outcome(
          state,
          false,
          "트레이너 지정 루틴은 수정할 수 없습니다."
        );
      if (
        kind === "routine" &&
        !source &&
        state.routines.length >= ROUTINE_LIMIT
      )
        return outcome(state, false, "루틴은 최대 5개까지 등록할 수 있습니다.");
      const routine = routineId
        ? state.routines.find((item) => item.id === routineId)
        : null;
      if (routineId && !routine)
        return outcome(state, false, "루틴을 찾을 수 없습니다.");
      const draft = {
        id,
        kind,
        sourceId: sourceId ?? null,
        title: source?.title ?? source?.name ?? routine?.name ?? "",
        date:
          source?.date ?? (isValidDateKey(date) ? date : state.selectedDate),
        startTime: source?.startTime ?? "11:30",
        endTime: source?.endTime ?? "12:30",
        memo: source?.memo ?? "",
        records: cloneExerciseRecords(
          source?.records ?? routine?.records ?? []
        ),
        dirty: !!routine,
      };
      return outcome(
        { ...state, drafts: { ...state.drafts, [id]: draft } },
        true,
        "",
        { draftId: id }
      );
    }
    case "PATCH_DRAFT": {
      const draft = state.drafts[action.id];
      if (!draft)
        return outcome(state, false, "작성 중인 내용을 찾을 수 없습니다.");
      const patch = Object.fromEntries(
        Object.entries(action.patch).filter(([key]) =>
          (draft.kind === "pt"
            ? ["memo", "records"]
            : ["title", "date", "startTime", "endTime", "memo", "records"]
          ).includes(key)
        )
      );
      if (patch.records) patch.records = cloneExerciseRecords(patch.records);
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [action.id]: { ...draft, ...patch, dirty: true },
        },
      };
    }
    case "APPEND_RECORDS": {
      const draft = state.drafts[action.id];
      if (!draft)
        return outcome(state, false, "작성 중인 내용을 찾을 수 없습니다.");
      if (!action.records.length)
        return outcome(state, false, "운동을 선택해주세요.");
      return outcome(
        {
          ...state,
          drafts: {
            ...state.drafts,
            [action.id]: {
              ...draft,
              records: [
                ...draft.records,
                ...cloneExerciseRecords(action.records),
              ],
              dirty: true,
            },
          },
        },
        true
      );
    }
    case "DROP_DRAFT": {
      const { [action.id]: removed, ...drafts } = state.drafts;
      return { ...state, drafts };
    }
    case "SAVE_DRAFT": {
      const draft = state.drafts[action.id];
      const invalid = validateDraft(draft);
      if (invalid) return outcome(state, false, invalid);
      const group =
        draft.kind === "routine"
          ? "routines"
          : draft.kind === "pt"
          ? "sessions"
          : "journals";
      const source = state[group].find((item) => item.id === draft.sourceId);
      if (draft.sourceId && !source)
        return outcome(
          state,
          false,
          "원본 기록이 삭제되어 저장할 수 없습니다."
        );
      if (draft.kind === "pt" && !canEditPTRecord(source))
        return outcome(state, false, "PT 기록 수정 권한이 없습니다.");
      if (
        draft.kind === "pt" &&
        ["date", "startTime", "endTime"].some((key) => draft[key] !== source[key])
      )
        return outcome(state, false, "PT 수업 날짜와 시간은 변경할 수 없습니다.");
      if (draft.kind === "routine" && source?.trainerAssigned)
        return outcome(
          state,
          false,
          "트레이너 지정 루틴은 수정할 수 없습니다."
        );
      if (
        draft.kind === "routine" &&
        !source &&
        state.routines.length >= ROUTINE_LIMIT
      )
        return outcome(state, false, "루틴은 최대 5개까지 등록할 수 있습니다.");
      const value = {
        ...source,
        id: source?.id ?? action.savedId,
        records: normalizeRecords(draft.records),
        ...(draft.kind === "routine"
          ? { name: draft.title.trim(), trainerAssigned: false }
          : draft.kind === "pt"
          ? { memo: draft.memo }
          : {
              title: draft.title.trim(),
              date: draft.date,
              startTime: draft.startTime,
              endTime: draft.endTime,
              memo: draft.memo,
            }),
      };
      const items = source
        ? state[group].map((item) => (item.id === source.id ? value : item))
        : [...state[group], value];
      const { [action.id]: removed, ...drafts } = state.drafts;
      const message =
        draft.kind === "routine"
          ? "루틴을 저장했어요."
          : "운동 기록을 저장했어요.";
      return outcome(
        {
          ...state,
          [group]: items,
          drafts,
          notice: message,
          ...(draft.kind === "journal" && { selectedDate: draft.date }),
        },
        true,
        message,
        { savedId: value.id, kind: draft.kind }
      );
    }
    case "DELETE_JOURNAL":
      return outcome(
        {
          ...state,
          journals: state.journals.filter((item) => item.id !== action.id),
          notice: "운동일지를 삭제했어요.",
        },
        true
      );
    case "DELETE_ROUTINE":
      return outcome(
        {
          ...state,
          routines: state.routines.filter((item) => item.id !== action.id),
          notice: "루틴을 삭제했어요.",
        },
        true
      );
    case "SAVE_EXERCISE": {
      const invalid = validateCustomExercise(action.exercise);
      if (invalid) return outcome(state, false, invalid);
      const source = state.exercises.find(
        (item) => item.id === action.exercise.id
      );
      if (source && !source.isCustom)
        return outcome(state, false, "기본 운동은 수정할 수 없습니다.");
      if (
        state.exercises.some(
          (item) =>
            item.id !== action.exercise.id &&
            item.name.trim() === action.exercise.name.trim()
        )
      )
        return outcome(state, false, "같은 이름의 운동이 이미 있습니다.");
      const value = {
        ...action.exercise,
        name: action.exercise.name.trim(),
        metrics: [...action.exercise.metrics],
        isCustom: true,
      };
      return outcome(
        {
          ...state,
          exercises: source
            ? state.exercises.map((item) =>
                item.id === value.id ? value : item
              )
            : [...state.exercises, value],
          notice: source ? "운동을 수정했어요." : "운동을 등록했어요.",
        },
        true,
        "",
        { exerciseId: value.id }
      );
    }
    case "DELETE_EXERCISE": {
      if (!state.exercises.find((item) => item.id === action.id)?.isCustom)
        return outcome(state, false, "기본 운동은 삭제할 수 없습니다.");
      return outcome(
        {
          ...state,
          exercises: state.exercises.filter((item) => item.id !== action.id),
          notice: "운동을 삭제했어요.",
        },
        true
      );
    }
    case "CONFIRM_PT": {
      const session = state.sessions.find((item) => item.id === action.id);
      if (
        !session ||
        !Number.isFinite(action.now) ||
        !isValidDateKey(session.date) ||
        !isValidTime(session.endTime) ||
        new Date(`${session.date}T${session.endTime}:00`).getTime() > action.now
      )
        return outcome(state, false, "PT 종료 시간 이후에 확인할 수 있습니다.");
      if (session.memberConfirmed) return outcome(state, true);
      return outcome(
        {
          ...state,
          sessions: state.sessions.map((item) =>
            item.id === action.id ? { ...item, memberConfirmed: true } : item
          ),
          notice: "PT 진행 완료를 확인했어요.",
        },
        true
      );
    }
    default:
      return state;
  }
}
