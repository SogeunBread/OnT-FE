import test from "node:test";
import assert from "node:assert/strict";
import { emptyUserTrainerState, userTrainerReducer as reduce, latestRequest, canChat, requestEditable, previewMessage, listTime } from "../features/user-trainer/state.js";

const stamp = (id) => ({ id, date: "2026-11-24", time: "10:00" });
const seed = () => reduce(emptyUserTrainerState, { type: "initialize", seed: { rooms: [{ id: "room", trainer: { name: "테스트 트레이너" }, matched: false, requests: [], messages: [], unreadCount: 2 }] } });
const request = (state, id = "r1") => reduce(state, { type: "request", roomId: "room", request: { id, note: "원본", sentAt: "2026-11-24T00:00:00Z", regions: ["서울"] }, stamp: stamp(`message-${id}`) });
test("initial request gates chat, prevents duplicates and separates request history", () => {
  let state = seed();
  assert.equal(canChat(state.rooms[0]), false);
  assert.equal(reduce(state, { type: "send", roomId: "room", message: { ...stamp("text"), kind: "text", text: "안녕" } }), state);
  state = request(state);
  assert.equal(canChat(state.rooms[0]), true);
  assert.equal(request(state, "r2"), state);
  state = reduce(state, { type: "cancel-request", roomId: "room", requestId: "r1", stamp: stamp("cancel") });
  assert.equal(canChat(state.rooms[0]), true);
  assert.equal(reduce(state, { type: "cancel-request", roomId: "room", requestId: "r1", stamp: stamp("again") }), state);
  state = request(state, "r2");
  assert.equal(latestRequest(state.rooms[0]).id, "r2");
  assert.equal(state.rooms[0].requests[0].status, "cancelled");
  assert.equal(state.rooms[0].messages[0].requestId, "r1");
});
test("request edits clone data, protect identity and readonly outcomes", () => {
  let state = request(seed());
  const details = { note: "새 내용", regions: ["파주"], id: "tampered", sentAt: "changed", status: "accepted" };
  state = reduce(state, { type: "edit-request", roomId: "room", requestId: "r1", details });
  details.regions.push("나중 변경");
  const item = latestRequest(state.rooms[0]);
  assert.equal(item.id, "r1"); assert.equal(item.status, "pending"); assert.equal(item.sentAt, "2026-11-24T00:00:00Z");
  assert.deepEqual(item.regions, ["파주"]);
  for (const status of ["accepted", "cancelled", "expired", "rejected"]) {
    const frozen = { ...state, rooms: [{ ...state.rooms[0], requests: [{ ...item, status }] }] };
    assert.equal(requestEditable(frozen.rooms[0], frozen.rooms[0].requests[0]), false);
    assert.equal(reduce(frozen, { type: "edit-request", roomId: "room", requestId: "r1", details: {} }), frozen);
  }
});
test("messages preserve drafts, mark read and reject empty or repeated sends", () => {
  let state = request(seed());
  state = reduce(state, { type: "draft", roomId: "room", text: "작성 중" });
  state = reduce(state, { type: "tab", tab: "previous" });
  assert.equal(state.drafts.room, "작성 중");
  state = reduce(state, { type: "read", roomId: "room" });
  assert.equal(state.rooms[0].unreadCount, 0);
  const photo = { ...stamp("photo"), kind: "photo", imageSource: { uri: "local-photo" } };
  state = reduce(state, { type: "send", roomId: "room", message: photo });
  assert.equal(state.drafts.room, "작성 중");
  assert.equal(reduce(state, { type: "send", roomId: "room", message: photo }), state);
  assert.equal(reduce(state, { type: "send", roomId: "room", message: { ...stamp("empty"), kind: "text", text: "  " } }), state);
  state = reduce(state, { type: "send", roomId: "room", message: { ...stamp("sent"), kind: "text", text: "보냄" } });
  assert.equal(state.drafts.room, "");
});
test("list labels distinguish cancellation from schedule cancellation and format dates", () => {
  for (const kind of ["request", "accepted", "rejected", "cancelled", "expired", "pt-create", "pt-update", "pt-delete", "photo", "meal", "feedback"]) assert.ok(previewMessage({ kind }));
  assert.notEqual(previewMessage({ kind: "cancelled" }), previewMessage({ kind: "pt-delete" }));
  assert.equal(listTime({ date: "2026-11-24", time: "12:30" }, "2026-11-24"), "12:30");
  assert.equal(listTime({ date: "2026-08-21", time: "12:30" }, "2026-11-24"), "8/21");
  assert.equal(reduce(seed(), { type: "send", roomId: "missing", message: {} }).rooms.length, 1);
});
