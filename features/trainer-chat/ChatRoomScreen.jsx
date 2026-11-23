import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import ChatRoom from "./ChatRoom";
import { useTrainerChat } from "./TrainerChatProvider";

export default function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { rooms, markRead, sendText, sendPhoto, acceptRequest, rejectRequest } = useTrainerChat();
  const room = rooms.find((item) => item.id === id);
  useEffect(() => { if (id) markRead(id); }, [id]);
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(trainerTabs)/chat");
  };
  return <ChatRoom key={id} room={room} onBack={goBack}
    onManage={() => router.push({ pathname: "/(trainer)/member-detail", params: { memberId: id, from: "chat" } })}
    onSendText={(text) => sendText(id, text)} onSendPhoto={(photo) => sendPhoto(id, photo)}
    onAccept={() => acceptRequest(id)} onReject={(reason) => rejectRequest(id, reason)} />;
}
