import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import Button from "@/components/button";
import TrainerMatching from "@/app/(userTabs)/trainer-matching";
import { useUserTrainer } from "./UserTrainerProvider";
import { settingsRoutes } from "@/features/user-settings/navigation";
import { requestEditable, latestRequest } from "./state";

export default function RequestEditScreen() {
  const params = useLocalSearchParams();
  const roomId = typeof params.roomId === "string" ? params.roomId : "";
  const requestId = typeof params.requestId === "string" ? params.requestId : null;
  const router = useRouter();
  const { state, submitRequest } = useUserTrainer();
  const room = state.rooms.find((item) => item.id === roomId);
  const request = room?.requests.find((item) => item.id === requestId);
  const allowed = room && (requestId ? requestEditable(room, request) : !["pending", "accepted"].includes(latestRequest(room)?.status) && !room.matched);
  const back = () => router.canGoBack() ? router.back() : router.replace(params.origin === "settings" ? settingsRoutes.history : "/(userTabs)/trainer");
  if (!allowed) return <View className="flex-1 items-center justify-center gap-5 px-4">
    <Text className="text-14 text-grayscale-G600">지금은 요청서를 작성하거나 수정할 수 없어요.</Text><Button accessibilityRole="button" text="돌아가기" onPress={back} />
  </View>;
  return <TrainerMatching key={`${roomId}-${requestId}`} initialAnswers={request?.answers ?? room.initialAnswers ?? {}} onCancel={back}
    onComplete={(answers, details) => {
      if (submitRequest(roomId, details, requestId)) router.dismissTo(params.origin === "settings" ? settingsRoutes.history : { pathname: "/(userTrainerFlow)/trainer-chat/[id]", params: { id: roomId } });
    }} />;
}
