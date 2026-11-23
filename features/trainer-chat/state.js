export function canGroupMessages(message, next) {
  return !!next && ["text", "photo"].includes(message.kind) &&
    ["text", "photo"].includes(next.kind) && message.writer === next.writer &&
    message.time === next.time && message.date === next.date;
}

// Pure local transitions. This is not a server request/permission contract.
export function trainerChatReducer(rooms, action) {
  const room = rooms.find((item) => item.id === action.roomId);
  if (!room) return rooms;
  if (action.type === "read") {
    if (!room.unreadCount) return rooms;
    return rooms.map((item) => item.id === room.id ? { ...item, unreadCount: 0 } : item);
  }
  if (action.type === "send") {
    const message = action.message;
    if (!message || !["text", "photo"].includes(message.kind) ||
      (message.kind === "text" && !message.text?.trim()) ||
      (message.kind === "photo" && !message.imageSource) ||
      room.messages.some((item) => item.id === message.id)) return rooms;
    const updated = { ...room, messages: [...room.messages, message],
      message: message.kind === "photo" ? "사진을 보냈어요." : message.text,
      time: message.time, unreadCount: 0 };
    return [updated, ...rooms.filter((item) => item.id !== room.id)];
  }
  if (action.type === "decide") {
    if (!room.request || room.requestStatus !== "pending" ||
      !["accepted", "rejected"].includes(action.status) ||
      (action.status === "rejected" && !action.reason?.trim())) return rooms;
    const status = action.status;
    const updated = { ...room, requestStatus: status,
      rejectionReason: status === "rejected" ? action.reason.trim() : undefined,
      category: status === "accepted" ? "member" : room.category,
      member: status === "accepted" ? action.member : room.member,
      messages: [...room.messages, { id: action.id, kind: status, date: action.date, reason: action.reason?.trim() }],
      message: status === "accepted" ? "PT 수업이 시작되었어요!" : "PT 수업 요청이 거절되었어요.",
      time: action.time, unreadCount: 0 };
    return [updated, ...rooms.filter((item) => item.id !== room.id)];
  }
  return rooms;
}
