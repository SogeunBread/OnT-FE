import assert from "node:assert/strict";
import test from "node:test";
import {
  cloneExerciseRecords,
  createExerciseRecord,
  formatExerciseDuration,
  isValidExerciseDuration,
  validateCustomExercise,
} from "../components/exercise/exerciseModel.js";

test("catalogue changes cannot mutate an existing exercise record", () => {
  const definition = {
    id: "bench",
    name: "벤치프레스",
    category: "가슴",
    metrics: ["weight", "reps"],
  };
  const record = createExerciseRecord(definition);
  definition.name = "변경된 이름";
  definition.metrics.push("rest");
  assert.equal(record.name, "벤치프레스");
  assert.deepEqual(record.metrics, ["weight", "reps"]);
  assert.deepEqual(record.sets, [{ weight: "0", reps: "0" }]);
  assert.notEqual(createExerciseRecord(definition).id, record.id);
});

test("copying a routine preserves its source when the journal is edited", () => {
  const routine = [
    createExerciseRecord({
      id: "squat",
      name: "스쿼트",
      metrics: ["weight", "reps"],
    }),
  ];
  const journal = cloneExerciseRecords(routine);
  journal[0].sets[0].weight = "60";
  journal[0].metrics.push("rest");
  journal.push(
    createExerciseRecord({ id: "run", name: "달리기", metrics: ["duration"] })
  );
  assert.equal(routine.length, 1);
  assert.equal(routine[0].sets[0].weight, "0");
  assert.deepEqual(routine[0].metrics, ["weight", "reps"]);
});

test("time-only exercises start with a duration and no set rows", () => {
  const record = createExerciseRecord({
    id: "run",
    name: "달리기",
    metrics: ["duration"],
  });
  assert.equal(record.duration, "00:00:00");
  assert.deepEqual(record.sets, []);
  assert.equal(isValidExerciseDuration(record.duration), true);
  assert.equal(isValidExerciseDuration("00:60:00"), false);
  assert.equal(isValidExerciseDuration("00:30:99"), false);
  assert.equal(formatExerciseDuration("01:05:30"), "1시간 5분 30초");
});

test("custom exercises require a name, known category and 1 to 3 unique metrics", () => {
  const valid = { name: " 레그 컬 ", category: "하체", metrics: ["weight"] };
  assert.equal(validateCustomExercise(valid), null);
  for (const patch of [
    { name: "  " },
    { category: "알 수 없음" },
    { metrics: [] },
    { metrics: ["weight", "weight"] },
    { metrics: ["weight", "reps", "duration", "rest"] },
    { metrics: ["unknown"] },
  ]) {
    assert.ok(validateCustomExercise({ ...valid, ...patch }));
  }
  assert.equal(
    validateCustomExercise({ ...valid, metrics: ["weight", "reps", "rest"] }),
    null
  );
});
