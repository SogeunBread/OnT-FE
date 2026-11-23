import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyExerciseState,
  exerciseReducer as reduce,
  validateDraft,
  isValidDateKey,
  canEditPTRecord,
} from "../features/exercise/state.js";
import { createExerciseSeed } from "../features/exercise/mockData.js";
import { createExerciseRecord } from "../components/exercise/exerciseModel.js";
import { draftRoute } from "../features/exercise/navigation.js";

const seed = () =>
  reduce(emptyExerciseState, {
    type: "INITIALIZE",
    seed: createExerciseSeed(new Date(2026, 10, 4, 12)),
  });
const record = (state) => createExerciseRecord(state.exercises[0]);
function validDraft(state, kind = "journal", id = "draft") {
  state = reduce(state, { type: "OPEN_DRAFT", id, kind });
  return reduce(state, {
    type: "PATCH_DRAFT",
    id,
    patch: { title: "새 운동", records: [record(state)] },
  });
}

test("past and future journals save, select their date, and release only the saved draft", () => {
  for (const date of ["2025-01-01", "2027-12-31"]) {
    let state = validDraft(seed());
    state = reduce(state, { type: "OPEN_DRAFT", id: "other", kind: "routine" });
    state = reduce(state, {
      type: "PATCH_DRAFT",
      id: "draft",
      patch: { date, memo: "입력 유지" },
    });
    state = reduce(state, {
      type: "SAVE_DRAFT",
      id: "draft",
      savedId: "saved",
    });
    assert.equal(state.result.ok, true);
    assert.equal(
      state.journals.find((item) => item.id === "saved").memo,
      "입력 유지"
    );
    assert.equal(state.selectedDate, date);
    assert.equal(state.drafts.draft, undefined);
    assert.ok(state.drafts.other);
  }
});

test("selecting additional exercises preserves title, times and existing set values", () => {
  let state = validDraft(seed());
  state = reduce(state, {
    type: "PATCH_DRAFT",
    id: "draft",
    patch: { startTime: "09:00", endTime: "10:30", memo: "초안" },
  });
  state = reduce(state, {
    type: "APPEND_RECORDS",
    id: "draft",
    records: [createExerciseRecord(state.exercises[1])],
  });
  assert.equal(state.drafts.draft.records.length, 2);
  assert.equal(state.drafts.draft.title, "새 운동");
  assert.equal(state.drafts.draft.startTime, "09:00");
  assert.equal(state.drafts.draft.memo, "초안");
  assert.equal(validateDraft(state.drafts.draft), null);
});

test("empty exercises cannot save, but zero duration and zero set values can", () => {
  let state = reduce(seed(), {
    type: "OPEN_DRAFT",
    id: "draft",
    kind: "journal",
  });
  state = reduce(state, {
    type: "PATCH_DRAFT",
    id: "draft",
    patch: { title: "제목" },
  });
  assert.ok(validateDraft(state.drafts.draft));
  state = reduce(state, {
    type: "APPEND_RECORDS",
    id: "draft",
    records: [record(state), createExerciseRecord(state.exercises[1])],
  });
  assert.equal(validateDraft(state.drafts.draft), null);
});

test("invalid dates, reversed times, excessive text and invalid record values are rejected", () => {
  const state = validDraft(seed());
  const draft = state.drafts.draft;
  assert.equal(isValidDateKey("2026-02-30"), false);
  assert.equal(isValidDateKey("2028-02-29"), true);
  for (const patch of [
    { date: "2026-02-30" },
    { endTime: "01:00" },
    { startTime: "25:00" },
    { title: "x".repeat(21) },
    { memo: "x".repeat(201) },
  ])
    assert.ok(validateDraft({ ...draft, ...patch }));
  const strength = createExerciseRecord(state.exercises[1]);
  strength.sets[0].reps = "-1";
  assert.ok(validateDraft({ ...draft, records: [strength] }));
});

test("editing and cancelling a journal never mutate its saved record", () => {
  let state = seed();
  const before = structuredClone(state.journals[0]);
  state = reduce(state, {
    type: "OPEN_DRAFT",
    id: "draft",
    kind: "journal",
    sourceId: before.id,
  });
  state.drafts.draft.records[1].sets[0].weight = "80";
  assert.deepEqual(state.journals[0], before);
  state = reduce(state, { type: "DROP_DRAFT", id: "draft" });
  assert.deepEqual(state.journals[0], before);
});

test("routine edits update a single record and creation is capped at five including trainer routines", () => {
  let state = seed();
  const originalLength = state.routines.length;
  state = reduce(state, {
    type: "OPEN_DRAFT",
    id: "edit",
    kind: "routine",
    sourceId: "routine-personal",
  });
  state = reduce(state, {
    type: "PATCH_DRAFT",
    id: "edit",
    patch: { title: "수정한 루틴" },
  });
  state = reduce(state, { type: "SAVE_DRAFT", id: "edit", savedId: "ignored" });
  assert.equal(state.routines.length, originalLength);
  assert.equal(
    state.routines.find((item) => item.id === "routine-personal").name,
    "수정한 루틴"
  );
  for (let i = originalLength; i < 5; i++) {
    state = validDraft(state, "routine", `new-${i}`);
    state = reduce(state, {
      type: "SAVE_DRAFT",
      id: `new-${i}`,
      savedId: `routine-${i}`,
    });
    assert.equal(state.result.ok, true);
  }
  state = reduce(state, { type: "OPEN_DRAFT", id: "sixth", kind: "routine" });
  assert.equal(state.result.ok, false);
  assert.equal(state.routines.length, 5);
});

test("two pending routine forms cannot race past the five routine limit", () => {
  let state = seed();
  while (state.routines.length < 4) {
    state = validDraft(state, "routine", "fill");
    state = reduce(state, {
      type: "SAVE_DRAFT",
      id: "fill",
      savedId: `fill-${state.routines.length}`,
    });
  }
  state = validDraft(state, "routine", "a");
  state = validDraft(state, "routine", "b");
  state = reduce(state, { type: "SAVE_DRAFT", id: "a", savedId: "a" });
  state = reduce(state, { type: "SAVE_DRAFT", id: "b", savedId: "b" });
  assert.equal(state.routines.length, 5);
  assert.equal(state.result.ok, false);
  assert.ok(state.drafts.b);
});

test("trainer-assigned routines cannot be edited, can be deleted, and copied journals survive deletion", () => {
  let state = seed();
  state = reduce(state, {
    type: "OPEN_DRAFT",
    id: "blocked",
    kind: "routine",
    sourceId: "routine-trainer",
  });
  assert.equal(state.result.ok, false);
  state = reduce(state, {
    type: "OPEN_DRAFT",
    id: "copy",
    kind: "journal",
    routineId: "routine-trainer",
  });
  const snapshot = structuredClone(state.drafts.copy.records);
  state = reduce(state, { type: "DELETE_ROUTINE", id: "routine-trainer" });
  assert.deepEqual(state.drafts.copy.records, snapshot);
  assert.equal(
    state.routines.some((item) => item.id === "routine-trainer"),
    false
  );
});

test("MY exercise editing and deletion preserve exercise snapshots in journals and drafts", () => {
  let state = validDraft(seed());
  const custom = state.exercises.find((item) => item.isCustom);
  state = reduce(state, {
    type: "APPEND_RECORDS",
    id: "draft",
    records: [createExerciseRecord(custom)],
  });
  state = reduce(state, {
    type: "SAVE_EXERCISE",
    exercise: { ...custom, name: "새 이름", metrics: ["reps"] },
  });
  assert.equal(state.result.ok, true);
  state = reduce(state, { type: "DELETE_EXERCISE", id: custom.id });
  assert.equal(state.drafts.draft.records.at(-1).name, custom.name);
  assert.deepEqual(state.drafts.draft.records.at(-1).metrics, custom.metrics);
  state = reduce(state, { type: "DELETE_EXERCISE", id: "run" });
  assert.equal(state.result.ok, false);
});

test("PT confirmation is after its end time, idempotent and does not change purchased sessions", () => {
  let state = seed();
  state = reduce(state, {
    type: "CONFIRM_PT",
    id: "pt-today",
    now: new Date(2026, 10, 4, 15).getTime(),
  });
  assert.equal(state.result.ok, false);
  const now = new Date(2026, 10, 4, 17).getTime();
  state = reduce(state, { type: "CONFIRM_PT", id: "pt-today", now });
  state = reduce(state, { type: "CONFIRM_PT", id: "pt-today", now });
  assert.equal(state.sessions[0].memberConfirmed, true);
  assert.equal(state.sessions[0].trainerConfirmed, false);
  assert.equal(state.sessions[0].totalSessions, 10);
  assert.equal(state.sessions[0].sessionNumber, 4);
  assert.equal(canEditPTRecord(state.sessions[0]), false);
  state = reduce(state, {
    type: "OPEN_DRAFT",
    id: "pt-edit",
    kind: "pt",
    sourceId: "pt-today",
  });
  assert.equal(state.result.ok, false);
});

test("draft routes retain identity and missing originals do not create new saved records", () => {
  let state = reduce(seed(), {
    type: "OPEN_DRAFT",
    id: "draft",
    kind: "routine",
    sourceId: "routine-personal",
  });
  assert.deepEqual(draftRoute(state.drafts.draft).params, {
    id: "routine-personal",
    draftId: "draft",
  });
  state = reduce(state, { type: "DELETE_ROUTINE", id: "routine-personal" });
  state = reduce(state, {
    type: "SAVE_DRAFT",
    id: "draft",
    savedId: "unexpected",
  });
  assert.equal(state.result.ok, false);
  assert.equal(
    state.routines.some((item) => item.id === "unexpected"),
    false
  );
});

test("member PT edits require explicit completion regardless of confirmations", () => {
  for (const status of [undefined, "scheduled", "in_progress", "cancelled"]) {
    assert.equal(canEditPTRecord({ status, memberConfirmed: true, trainerConfirmed: true }), false);
  }
  for (const memberConfirmed of [false, true]) {
    for (const trainerConfirmed of [false, true]) {
      let state = seed();
      state.sessions[1] = { ...state.sessions[1], memberConfirmed, trainerConfirmed };
      const original = structuredClone(state.sessions[1]);
      assert.equal(canEditPTRecord(original), true);
      state = reduce(state, { type: "OPEN_DRAFT", id: "pt", kind: "pt", sourceId: original.id });
      assert.equal(state.result.ok, true);
      state = reduce(state, { type: "PATCH_DRAFT", id: "pt", patch: {
        date: "2030-01-01", startTime: "01:00", endTime: "02:00", memo: "수정한 메모",
      } });
      assert.equal(state.drafts.pt.date, original.date);
      assert.equal(state.drafts.pt.startTime, original.startTime);
      assert.equal(state.drafts.pt.endTime, original.endTime);
      state = reduce(state, { type: "SAVE_DRAFT", id: "pt" });
      assert.equal(state.result.ok, true);
      assert.deepEqual(state.sessions[1], { ...original, memo: "수정한 메모" });
    }
  }
});

test("PT save rechecks completion and rejects a tampered lesson schedule", () => {
  let state = reduce(seed(), { type: "OPEN_DRAFT", id: "pt", kind: "pt", sourceId: "pt-yesterday" });
  const original = structuredClone(state.sessions[1]);
  state = { ...state, drafts: { ...state.drafts, pt: { ...state.drafts.pt, date: "2030-01-01" } } };
  state = reduce(state, { type: "SAVE_DRAFT", id: "pt" });
  assert.equal(state.result.ok, false);
  assert.deepEqual(state.sessions[1], original);
  state.drafts.pt.date = original.date;
  state.sessions[1] = { ...original, status: "in_progress" };
  state = reduce(state, { type: "SAVE_DRAFT", id: "pt" });
  assert.equal(state.result.ok, false);
  assert.ok(state.drafts.pt);
});
