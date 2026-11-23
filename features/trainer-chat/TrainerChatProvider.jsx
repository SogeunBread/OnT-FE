import { createMatchedMember, trainerChatRooms } from "@/constants/trainerChat";
import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { trainerChatReducer } from "./state";

const TrainerChatContext = createContext(null);
let sequence = 0;
function messageStamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return { id: `local-${now.getTime()}-${sequence++}`,
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}` };
}

export default function TrainerChatProvider({ children }) {
  const [rooms, dispatch] = useReducer(trainerChatReducer, trainerChatRooms);
  const photoUrls = useRef(new Set());
  useEffect(() => () => {
    if (typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
      photoUrls.current.forEach((uri) => URL.revokeObjectURL(uri));
    }
  }, []);
  const sendText = (roomId, value) => {
    const text = value.trim();
    if (text) dispatch({ type: "send", roomId, message: { ...messageStamp(), kind: "text", writer: "me", text } });
  };
  const sendPhoto = (roomId, photo) => {
    if (photo.uri.startsWith("blob:")) photoUrls.current.add(photo.uri);
    dispatch({ type: "send", roomId,
      message: { ...messageStamp(), kind: "photo", writer: "me", imageSource: { uri: photo.uri }, imageAspectRatio: photo.width / photo.height } });
  };
  const decide = (roomId, status, reason) => {
    const room = rooms.find((item) => item.id === roomId);
    if (!room) return;
    dispatch({ type: "decide", roomId, status, reason, ...messageStamp(),
      member: createMatchedMember(room.request?.lessonCount ?? 0) });
  };
  return (
    <TrainerChatContext.Provider value={{ rooms, sendText, sendPhoto,
      markRead: (roomId) => dispatch({ type: "read", roomId }),
      acceptRequest: (roomId) => decide(roomId, "accepted"),
      rejectRequest: (roomId, reason) => decide(roomId, "rejected", reason) }}>
      {children}
    </TrainerChatContext.Provider>
  );
}

export function useTrainerChat() {
  const context = useContext(TrainerChatContext);
  if (!context) throw new Error("TrainerChatProvider가 필요합니다.");
  return context;
}
