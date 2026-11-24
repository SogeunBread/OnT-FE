// Local UI model only. No server contract, automatic matching or session deductions.
export const emptyUserTrainerState = { ready: false, rooms: [], selectedTab: "current", drafts: {} };
export const copy = (value) => JSON.parse(JSON.stringify(value));
export const latestRequest = (room) => room?.requests?.at(-1);
export const canChat = (room) => !!room?.requests?.length;
export function previewMessage(message) {
  if (!message) return "";
  const labels = {
    request: "PT 수업 요청이 전송됐어요! 트레이너가 요청을 확인한 후 수락 여부를 결정해요.",
    cancelled: "PT 수업 요청이 취소되었어요. 회원이 직접 수업 요청을 취소했습니다.",
    expired: "PT 수업 요청이 취소되었어요. 3일이 지나 자동으로 취소되었습니다.",
    rejected: "트레이너가 PT 수업을 거절했어요.",
    accepted: "PT 수업이 시작되었어요!", photo: "사진을 보냈어요.",
    meal: "식단 피드백 요청을 보냈어요.", feedback: "식단 피드백이 도착했어요.",
    "pt-create": "트레이너님과 PT 수업이 예약되었어요.",
    "pt-update": "트레이너님이 PT 수업을 수정했어요.",
    "pt-delete": "트레이너님과 PT 수업이 취소되었어요.",
  };
  return labels[message.kind] ?? message.text ?? "";
}
export function listTime(message, today) {
  if (!message?.date) return "";
  if (message.date === today) return message.time ?? "";
  const [, month, day] = message.date.split("-").map(Number);
  return `${month}/${day}`;
}
export const requestEditable = (room, request) =>
  request?.status === "pending" && latestRequest(room)?.id === request.id;
export function userTrainerReducer(state, action) {
  if (action.type === "initialize") return state.ready ? state : { ...emptyUserTrainerState, ...action.seed, ready: true };
  if (action.type === "tab") return { ...state, selectedTab: action.tab === "previous" ? "previous" : "current" };
  if (action.type === "add-demo-room") return state.rooms.some((item) => item.id === action.room.id) ? state : { ...state, rooms: [...state.rooms, copy(action.room)] };
  const room = state.rooms.find((item) => item.id === action.roomId);
  if (!room) return state;
  const update = (value, reorder = false) => ({ ...state, rooms: reorder
    ? [value, ...state.rooms.filter((item) => item.id !== room.id)]
    : state.rooms.map((item) => item.id === room.id ? value : item) });
  if (action.type === "read") return room.unreadCount ? update({ ...room, unreadCount: 0 }) : state;
  if (action.type === "draft") return { ...state, drafts: { ...state.drafts, [room.id]: action.text } };
  if (action.type === "send") {
    const message = action.message;
    if (!canChat(room) || !message?.id || room.messages.some((item) => item.id === message.id) ||
      !["text", "photo"].includes(message.kind) ||
      (message.kind === "text" && !message.text?.trim()) ||
      (message.kind === "photo" && !message.imageSource)) return state;
    const next = update({ ...room, messages: [...room.messages, copy(message)], unreadCount: 0 }, true);
    return message.kind === "text" ? { ...next, drafts: { ...next.drafts, [room.id]: "" } } : next;
  }
  if (action.type === "request") {
    const pending = latestRequest(room);
    if (room.matched || ["pending", "accepted"].includes(pending?.status) || !action.request?.id ||
      room.requests.some((item) => item.id === action.request.id)) return state;
    const request = { ...copy(action.request), status: "pending" };
    return update({ ...room, requests: [...room.requests, request], unreadCount: 0,
      messages: [...room.messages, { ...action.stamp, kind: "request", requestId: request.id }] }, true);
  }
  if (action.type === "edit-request") {
    const request = room.requests.find((item) => item.id === action.requestId);
    if (!requestEditable(room, request)) return state;
    // Preserve identity/time/status. Resetting the deadline on edit is not a decided policy.
    const { id, sentAt, status } = request;
    return update({ ...room, requests: room.requests.map((item) => item.id === id
      ? { ...item, ...copy(action.details), id, sentAt, status } : item) });
  }
  if (action.type === "cancel-request") {
    const request = room.requests.find((item) => item.id === action.requestId);
    if (!requestEditable(room, request)) return state;
    return update({ ...room, requests: room.requests.map((item) => item.id === request.id
      ? { ...item, status: "cancelled" } : item),
      messages: [...room.messages, { ...action.stamp, kind: "cancelled", requestId: request.id }] }, true);
  }
  return state;
}
