import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { createUserTrainerSeed, sampleUserRequest, userTrainerProfile } from "@/constants/userTrainer";
import { emptyUserTrainerState, userTrainerReducer } from "./state";

const Context = createContext(null);
let sequence = 0;
export function userMessageStamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return { id: `user-local-${now.getTime()}-${++sequence}`, date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`, time: `${pad(now.getHours())}:${pad(now.getMinutes())}` };
}
export default function UserTrainerProvider({ children, initialSeed }) {
  const [state, dispatch] = useReducer(userTrainerReducer, emptyUserTrainerState);
  const current = useRef(state);
  current.current = state;
  const urls = useRef(new Set());
  const send = useCallback((action) => {
    const previous = current.current;
    const next = userTrainerReducer(previous, action);
    current.current = next;
    dispatch(action);
    return next !== previous;
  }, []);
  useEffect(() => { send({ type: "initialize", seed: initialSeed ?? createUserTrainerSeed() }); }, [send, initialSeed]);
  useEffect(() => () => {
    if (typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") urls.current.forEach((uri) => URL.revokeObjectURL(uri));
  }, []);
  const sendText = (roomId) => {
    const text = current.current.drafts[roomId]?.trim();
    if (!text) return false;
    return send({ type: "send", roomId, message: { ...userMessageStamp(), kind: "text", writer: "me", text } });
  };
  const sendPhoto = (roomId, photo) => {
    if (!photo?.uri || !photo.width || !photo.height) return false;
    if (photo.uri.startsWith("blob:")) urls.current.add(photo.uri);
    return send({ type: "send", roomId, message: { ...userMessageStamp(), kind: "photo", writer: "me", imageSource: { uri: photo.uri }, imageAspectRatio: photo.width / photo.height } });
  };
  const submitRequest = (roomId, details, requestId) => {
    if (!current.current.rooms.some((room) => room.id === roomId)) return false;
    if (requestId) return send({ type: "edit-request", roomId, requestId, details });
    const stamp = userMessageStamp();
    return send({ type: "request", roomId, stamp,
      request: { ...sampleUserRequest, ...details, id: `request-${stamp.id}`, sentAt: new Date().toISOString(), trainerName: current.current.rooms.find((item) => item.id === roomId).trainer.name } });
  };
  const submitMatching = (details) => {
    const roomId = "matching-consultation";
    if (!current.current.rooms.some((room) => room.id === roomId)) send({ type: "add-demo-room", room: { id: roomId, trainer: userTrainerProfile, matched: false, unreadCount: 0, requests: [], messages: [] } });
    if (current.current.rooms.find((room) => room.id === roomId)?.requests.some((request) => ["pending", "accepted"].includes(request.status))) return roomId;
    return submitRequest(roomId, details) ? roomId : null;
  };
  return <Context.Provider value={{ state, send, sendText, sendPhoto, submitRequest, submitMatching }}>{children}</Context.Provider>;
}
export function useUserTrainer() {
  const value = useContext(Context);
  if (!value) throw new Error("UserTrainerProvider가 필요합니다.");
  return value;
}
