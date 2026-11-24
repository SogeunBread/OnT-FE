import test from "node:test";
import assert from "node:assert/strict";
import { settingsReducer, reviewAvailability, reviewDraftKey, requestHistoryRows } from "../features/user-settings/state.js";
const now = Date.parse("2026-11-24T12:00:00+09:00");
const policy = { windowDays: 90, textRequired: false, allowEdit: true, allowDelete: true };
const history = (days = 5) => ({ id: "contract-a", trainerId: "trainer-a", status: "ended", endedAt: new Date(now - days * 86400000).toISOString() });
const seed = () => ({ histories: [history()], reviews: [], drafts: {}, account: {}, notifications: { push: false, chat: false, night: false } });
const save = (extra = {}) => ({ type: "save-review", historyId: "contract-a", rating: 4, text: "  좋아요  ", now, policy, ...extra });
test("review eligibility uses contract completion and rejects future, missing, expired and duplicate history", () => {
  for (const value of [undefined, { ...history(), status: "active" }, history(-1), history(90.001), { ...history(), endedAt: "invalid" }]) assert.notEqual(reviewAvailability(value, [], now, policy), "");
  assert.equal(reviewAvailability(history(90), [], now, policy), "");
  assert.notEqual(reviewAvailability(history(), [{ historyId: "contract-a" }], now, policy), "");
});
test("review creation enforces integer stars, deadline, uniqueness and text policy", () => {
  const state = seed();
  for (const rating of [0, 6, 1.5, "4"]) assert.equal(settingsReducer(state, save({ rating })), state);
  assert.equal(settingsReducer(state, save({ historyId: "unknown" })), state);
  assert.equal(settingsReducer({ ...state, histories: [history(91)] }, save()).reviews.length, 0);
  assert.equal(settingsReducer(state, save({ text: "", policy: { ...policy, textRequired: true } })), state);
  const created = settingsReducer(state, save({ text: "" }));
  assert.equal(created.reviews.length, 1);
  assert.equal(settingsReducer(created, save()), created);
  assert.equal(state.reviews.length, 0);
});
test("saving and deleting keep history availability, own review and draft state consistent", () => {
  let state = seed(); const key = reviewDraftKey("contract-a");
  state = settingsReducer(state, { type: "draft", key, value: { rating: 4, text: "draft" } });
  state = settingsReducer(state, save()); const review = state.reviews[0];
  assert.equal(state.drafts[key], undefined); assert.equal(review.text, "좋아요");
  assert.equal(settingsReducer(state, save({ reviewId: "someone-else" })), state);
  const editKey = reviewDraftKey("contract-a", review.id);
  state = settingsReducer(state, { type: "draft", key: editKey, value: { rating: 5, text: "edit" } });
  const updated = settingsReducer(state, save({ reviewId: review.id, rating: 5, now: now + 100 * 86400000 }));
  assert.equal(updated.reviews[0].createdAt, review.createdAt); assert.equal(updated.reviews[0].rating, 5); assert.equal(updated.drafts[editKey], undefined);
  assert.equal(settingsReducer(updated, { type: "delete-review", id: review.id, policy: { ...policy, allowDelete: false } }), updated);
  const deleted = settingsReducer(updated, { type: "delete-review", id: review.id, policy });
  assert.equal(deleted.reviews.length, 0); assert.equal(reviewAvailability(deleted.histories[0], deleted.reviews, now, policy), "");
  assert.notEqual(reviewAvailability(deleted.histories[0], deleted.reviews, now + 100 * 86400000, policy), "");
});
test("push disables changes to subcategories while retaining their choices", () => {
  let state = seed(); assert.equal(settingsReducer(state, { type: "notification", key: "chat", value: true }), state);
  state = settingsReducer(state, { type: "notification", key: "push", value: true });
  state = settingsReducer(state, { type: "notification", key: "chat", value: true });
  state = settingsReducer(state, { type: "notification", key: "push", value: false });
  assert.equal(state.notifications.chat, true);
  assert.equal(settingsReducer(state, { type: "notification", key: "unknown", value: true }), state);
});
test("request history keeps room/request identities and maps expiry to cancellation without inferring contract end", () => {
  const rows = requestHistoryRows([{ id: "room-a", trainerId: "trainer-a", trainer: { name: "홍길동 트레이너" }, requests: ["pending", "rejected", "cancelled", "expired", "accepted"].map((status, i) => ({ id: String(i), status })) }], [{ id: "trainer-a", name: "홍길동" }]);
  assert.deepEqual(rows.map(item => item.status), ["pending", "rejected", "cancelled", "cancelled", "active"]);
  assert.equal(new Set(rows.map(item => item.id)).size, 5);
  assert.equal(rows[0].roomId, "room-a"); assert.equal(rows[0].requestId, "0"); assert.equal(rows[4].endedAt, undefined);
});
test("different contracts with the same trainer keep separate reviews and editing honors the policy switch", () => {
  const initial = { ...seed(), histories: [history(), { ...history(), id: "contract-b" }] };
  const first = settingsReducer(initial, save());
  const second = settingsReducer(first, save({ historyId: "contract-b" }));
  assert.equal(second.reviews.length, 2);
  assert.equal(new Set(second.reviews.map(item => item.id)).size, 2);
  const denied = settingsReducer(second, save({ reviewId: first.reviews[0].id, policy: { ...policy, allowEdit: false } }));
  assert.equal(denied, second);
});
