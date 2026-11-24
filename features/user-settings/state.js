// UI-only review policy. Server time, ownership and contract status must be rechecked by the API.
export function reviewAvailability(history, reviews, now, policy) {
  if (!history || history.status !== "ended") return "수업이 종료된 후 리뷰를 작성할 수 있어요.";
  if (reviews.some(item => item.historyId === history.id)) return "이미 리뷰를 작성한 수업이에요.";
  const end = Date.parse(history.endedAt);
  if (!Number.isFinite(end) || end > now || now - end > policy.windowDays * 86400000) return "리뷰 작성 기간이 지났어요.";
  return "";
}
export function reviewDraftKey(historyId, reviewId) { return reviewId ? `edit:${reviewId}` : `create:${historyId}`; }
export function settingsReducer(state, action) {
  switch (action.type) {
    case "account": return { ...state, account: action.value };
    case "notification": {
      if (!Object.hasOwn(state.notifications, action.key) || (action.key !== "push" && !state.notifications.push)) return state;
      return { ...state, notifications: { ...state.notifications, [action.key]: Boolean(action.value) } };
    }
    case "draft": return { ...state, drafts: { ...state.drafts, [action.key]: action.value } };
    case "save-review": {
      const { historyId, reviewId, rating, text, now, policy } = action;
      if (!Number.isInteger(rating) || rating < 1 || rating > 5 || typeof text !== "string" || (policy.textRequired && !text.trim())) return state;
      const existing = state.reviews.find(item => item.id === reviewId && item.historyId === historyId);
      const history = state.histories.find(item => item.id === historyId);
      if (reviewId ? !existing || !policy.allowEdit : reviewAvailability(history, state.reviews, now, policy)) return state;
      const date = new Date(now).toISOString();
      const review = existing ? { ...existing, rating, text: text.trim(), updatedAt: date } : { id: `review:${historyId}`, historyId, trainerId: history.trainerId, rating, text: text.trim(), createdAt: date, updatedAt: null };
      const drafts = { ...state.drafts }; delete drafts[reviewDraftKey(historyId, reviewId)];
      return { ...state, drafts, reviews: existing ? state.reviews.map(item => item.id === reviewId ? review : item) : [review, ...state.reviews] };
    }
    case "delete-review": {
      if (!action.policy.allowDelete || !state.reviews.some(item => item.id === action.id)) return state;
      const drafts = { ...state.drafts }; delete drafts[`edit:${action.id}`];
      return { ...state, drafts, reviews: state.reviews.filter(item => item.id !== action.id) };
    }
    default: return state;
  }
}
// Contract completion is intentionally separate from accepted matching requests.
export function requestHistoryRows(rooms, trainers) {
  return rooms.flatMap(room => room.requests.map(request => {
    const trainer = trainers.find(item => item.id === (room.trainerId ?? room.id)) ?? { ...room.trainer, name: room.trainer.name.replace(/ 트레이너$/, ""), location: { name: room.trainer.gymName ?? room.trainer.location?.name ?? "" } };
    return { id: `request:${room.id}:${request.id}`, roomId: room.id, requestId: request.id, trainerId: trainer.id ?? null, trainer,
      status: ({ pending: "pending", rejected: "rejected", cancelled: "cancelled", expired: "cancelled", accepted: "active" })[request.status] ?? "cancelled" };
  }));
}
