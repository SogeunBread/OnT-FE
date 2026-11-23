import assert from "node:assert/strict";
import test from "node:test";
import {
  canGroupMessages,
  trainerChatReducer as reduce,
} from "../features/trainer-chat/state.js";

function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

const text = (id, overrides = {}) => ({
  id,
  kind: "text",
  writer: "me",
  text: "다음 수업 때 뵐게요.",
  date: "2026-11-24",
  time: "15:22",
  ...overrides,
});

function seed() {
  return freeze([
    {
      id: "existing-member",
      memberName: "기존 회원",
      category: "member",
      member: { totalPT: 20, completedPT: 8 },
      unreadCount: 0,
      message: "확인했습니다.",
      time: "14:00",
      messages: [text("existing-message", { writer: "you" })],
    },
    {
      id: "pending-request",
      memberName: "상담 회원",
      category: "consultation",
      request: { lessonCount: 10, purpose: "꾸준한 관리용" },
      requestStatus: "pending",
      unreadCount: 3,
      message: "PT 수업 요청",
      time: "13:00",
      messages: [{ id: "request", kind: "request", date: "2026-11-24" }],
    },
    {
      id: "other-request",
      memberName: "다른 상담 회원",
      category: "consultation",
      request: { lessonCount: 20 },
      requestStatus: "pending",
      unreadCount: 2,
      messages: [],
    },
  ]);
}

const decision = (overrides = {}) => ({
  type: "decide",
  roomId: "pending-request",
  id: "decision-result",
  status: "accepted",
  date: "2026-11-24",
  time: "15:22",
  member: { gender: "미입력", age: null, totalPT: 10, completedPT: 0, progress: 0 },
  ...overrides,
});

test("unknown rooms and unsupported transitions leave all rooms unchanged", () => {
  const rooms = seed();
  for (const type of ["read", "send", "decide"]) {
    assert.strictEqual(reduce(rooms, {
      ...decision(), type, roomId: "missing", message: text("sent"),
    }), rooms);
  }
  assert.strictEqual(reduce(rooms, { type: "unknown", roomId: rooms[0].id }), rooms);
});

test("reading clears only the selected unread badge without reordering or changing history", () => {
  const rooms = seed();
  const next = reduce(rooms, { type: "read", roomId: "pending-request" });
  assert.deepEqual(next.map((room) => room.id), rooms.map((room) => room.id));
  assert.equal(next[1].unreadCount, 0);
  assert.strictEqual(next[1].messages, rooms[1].messages);
  assert.strictEqual(next[0], rooms[0]);
  assert.strictEqual(next[2], rooms[2]);
  assert.strictEqual(reduce(next, { type: "read", roomId: "pending-request" }), next);
  assert.equal(rooms[1].unreadCount, 3);
});

test("empty rejection reasons and invalid statuses cannot resolve a pending request", () => {
  const rooms = seed();
  for (const reason of [undefined, "", "  \n\t  "]) {
    assert.strictEqual(reduce(rooms, decision({ status: "rejected", reason })), rooms);
  }
  assert.strictEqual(reduce(rooms, decision({ status: "pending" })), rooms);
  assert.strictEqual(reduce(rooms, decision({ roomId: "existing-member" })), rooms);
});

test("rejection trims the reason, appends one result and retains consultation membership", () => {
  const rooms = seed();
  const next = reduce(rooms, decision({ status: "rejected", reason: "  일정이 맞지 않습니다\n" }));
  const rejected = next[0];
  assert.equal(rejected.id, "pending-request");
  assert.equal(rejected.category, "consultation");
  assert.equal(rejected.requestStatus, "rejected");
  assert.equal(rejected.rejectionReason, "일정이 맞지 않습니다");
  assert.equal(rejected.messages.at(-1).reason, rejected.rejectionReason);
  assert.equal(rejected.messages.at(-1).kind, "rejected");
  assert.equal(rejected.messages.length, rooms[1].messages.length + 1);
  assert.equal(rejected.unreadCount, 0);
  assert.equal(rejected.message, "PT 수업 요청이 거절되었어요.");
  assert.equal(rejected.time, "15:22");
  assert.strictEqual(rejected.request, rooms[1].request);
  assert.strictEqual(reduce(next, decision()), next);
  assert.strictEqual(reduce(next, decision({ status: "rejected", reason: "다른 사유" })), next);
});

test("acceptance moves only the selected room into members with the supplied member data", () => {
  const rooms = seed();
  const action = decision();
  const next = reduce(rooms, action);
  const accepted = next[0];
  assert.equal(accepted.id, "pending-request");
  assert.equal(accepted.category, "member");
  assert.equal(accepted.requestStatus, "accepted");
  assert.deepEqual(accepted.member, action.member);
  assert.equal(accepted.rejectionReason, undefined);
  assert.equal(accepted.message, "PT 수업이 시작되었어요!");
  assert.equal(accepted.unreadCount, 0);
  assert.deepEqual(accepted.messages.slice(0, -1), rooms[1].messages);
  assert.deepEqual(accepted.messages.at(-1), {
    id: "decision-result", kind: "accepted", date: "2026-11-24", reason: undefined,
  });
  assert.strictEqual(next[1], rooms[0]);
  assert.strictEqual(next[2], rooms[2]);
  assert.equal(next[2].requestStatus, "pending");
  assert.strictEqual(reduce(next, decision({ id: "duplicate-decision" })), next);
  assert.strictEqual(reduce(next, decision({ status: "rejected", reason: "일정 변경" })), next);
  assert.equal(rooms[1].requestStatus, "pending");
});

test("sending text appends history, clears unread and promotes only that conversation", () => {
  const rooms = seed();
  const message = text("sent-text");
  const next = reduce(rooms, { type: "send", roomId: "pending-request", message });
  assert.deepEqual(next.map((room) => room.id), ["pending-request", "existing-member", "other-request"]);
  assert.equal(next[0].message, message.text);
  assert.equal(next[0].time, message.time);
  assert.equal(next[0].unreadCount, 0);
  assert.deepEqual(next[0].messages, [...rooms[1].messages, message]);
  assert.equal(next[0].requestStatus, "pending");
  assert.strictEqual(next[1], rooms[0]);
  assert.strictEqual(next[2], rooms[2]);
});

test("sending a photo preserves its source and aspect ratio while updating the list preview", () => {
  const rooms = seed();
  const message = {
    id: "sent-photo", kind: "photo", writer: "me", date: "2026-11-24", time: "16:00",
    imageSource: { uri: "file:///local/workout.jpg" }, imageAspectRatio: 2,
  };
  const next = reduce(rooms, { type: "send", roomId: "other-request", message });
  assert.equal(next[0].id, "other-request");
  assert.equal(next[0].message, "사진을 보냈어요.");
  assert.equal(next[0].unreadCount, 0);
  assert.equal(next[0].time, "16:00");
  assert.deepEqual(next[0].messages.at(-1), message);
  assert.strictEqual(next[1], rooms[0]);
  assert.strictEqual(next[2], rooms[1]);
});

test("invalid and duplicate messages cannot create blank bubbles or duplicate history", () => {
  const rooms = seed();
  for (const message of [
    undefined,
    text("blank", { text: " \t\n " }),
    text("missing", { text: undefined }),
    { id: "photo", kind: "photo" },
    { id: "unsupported", kind: "accepted" },
    text("request"),
  ]) {
    assert.strictEqual(reduce(rooms, { type: "send", roomId: "pending-request", message }), rooms);
  }
  const action = { type: "send", roomId: "pending-request", message: text("once") };
  const next = reduce(rooms, action);
  assert.strictEqual(reduce(next, action), next);
});

test("adjacent text and photo messages group only within the same writer, date and minute", () => {
  const current = text("first");
  assert.equal(canGroupMessages(current, text("second")), true);
  assert.equal(canGroupMessages(current, text("photo", { kind: "photo" })), true);
  assert.equal(canGroupMessages({ ...current, kind: "photo" }, text("second")), true);
  for (const next of [
    undefined,
    text("different-writer", { writer: "you" }),
    text("different-minute", { time: "15:23" }),
    text("different-date", { date: "2026-11-25" }),
  ]) assert.equal(canGroupMessages(current, next), false);
});

test("request and decision cards break timestamp groups even with matching metadata", () => {
  const message = text("ordinary");
  for (const kind of ["request", "accepted", "rejected"]) {
    const card = { ...message, id: kind, kind };
    assert.equal(canGroupMessages(message, card), false);
    assert.equal(canGroupMessages(card, message), false);
    assert.equal(canGroupMessages(card, { ...card, id: "other-card" }), false);
  }
});
