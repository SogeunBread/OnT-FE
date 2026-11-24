import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUserTrainer, userMessageStamp } from "./UserTrainerProvider";
import UserChatRoom from "./UserChatRoom";

export default function UserChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { state, send, sendText, sendPhoto } = useUserTrainer();
  useEffect(() => { if (state.ready && id) send({ type: "read", roomId: id }); }, [id, state.ready, send]);
  const back = () => router.canGoBack() ? router.back() : router.replace("/(userTabs)/trainer");
  const edit = (request) => router.push({ pathname: "/(userTrainerFlow)/request-edit", params: { roomId: id, ...(request && { requestId: request.id }) } });
  return <UserChatRoom key={id} room={state.rooms.find((room) => room.id === id)} draft={state.drafts[id] ?? ""}
    onDraft={(text) => send({ type: "draft", roomId: id, text })} onBack={back}
    onSendText={() => sendText(id)} onSendPhoto={(photo) => sendPhoto(id, photo)}
    onNewRequest={() => edit()} onEditRequest={edit}
    onCancelRequest={(requestId) => send({ type: "cancel-request", roomId: id, requestId, stamp: userMessageStamp() })} />;
}
