import { createUserTrainerMeals } from "@/constants/userTrainerMeals";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaInsetsContext, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import { userTabs } from "@/constants/userTabs";
import { scenarioSeed, userTrainerScenarios } from "@/constants/userTrainer";
import { ExerciseProvider } from "@/features/exercise/ExerciseProvider";
import { MealRecordsProvider } from "@/components/meal-record/MealRecordsContext";
import TrainerMatching from "@/app/(userTabs)/trainer-matching";
import UserTrainerProvider, { useUserTrainer, userMessageStamp } from "./UserTrainerProvider";
import { TrainerTabView } from "./TrainerTabScreen";
import UserChatRoom from "./UserChatRoom";
import RecordDetails from "./RecordDetails";

const tabScenarios = ["current", "no-lesson", "previous", "unmatched", "special-list"];
function PreviewFlow({ scenario, onClose }) {
  const { state, send, sendText, sendPhoto, submitRequest } = useUserTrainer();
  const [roomId, setRoomId] = useState(tabScenarios.includes(scenario) ? null : "jaemin");
  const [editing, setEditing] = useState(null);
  const [record, setRecord] = useState(null);
  const room = state.rooms.find((item) => item.id === roomId);
  if (!state.ready) return <View className="flex-1 bg-white" />;
  if (editing) return <TrainerMatching initialAnswers={editing.request?.answers ?? {}} onCancel={() => setEditing(null)}
    onComplete={(answers, details) => { if (submitRequest(roomId, details, editing.request?.id)) setEditing(null); }} />;
  if (!roomId) return <View className="flex-1 bg-white">
    <HeaderMain menuName="트레이너" />
    <TrainerTabView state={state} onTab={(tab) => send({ type: "tab", tab })} onChat={setRoomId} onLesson={(id) => setRecord({ kind: "pt", id })} />
    <NavigationBar tabs={userTabs} state={{ routes: userTabs.map((item) => ({ key: item.name, name: item.name })), index: 3 }}
      navigation={{ emit: () => ({ defaultPrevented: false }), navigate: onClose }} labelClassName="mt-2" />
    <RecordDetails detail={record} onClose={() => setRecord(null)} />
  </View>;
  return <UserChatRoom key={roomId} room={room} draft={state.drafts[roomId] ?? ""}
    onDraft={(text) => send({ type: "draft", roomId, text })} onSendText={() => sendText(roomId)}
    onBack={() => tabScenarios.includes(scenario) ? setRoomId(null) : onClose()}
    onSendPhoto={(photo) => photo.source ? send({ type: "send", roomId, message: { ...userMessageStamp(), kind: "photo", writer: "me", imageSource: photo.source, imageAspectRatio: photo.width / photo.height } }) : sendPhoto(roomId, photo)}
    onCancelRequest={(requestId) => send({ type: "cancel-request", roomId, requestId, stamp: userMessageStamp() })}
    onEditRequest={(request) => setEditing({ request })} onNewRequest={() => setEditing({ request: null })}
    initialRequest={["request", "long-request", "cancel-dialog"].includes(scenario)} initialConfirm={scenario === "cancel-dialog"}
    initialPhoto={scenario === "photo-preview"} initialFocus={["typing", "sent"].includes(scenario)} />;
}
function PreviewProvider({ scenario, onClose }) {
  const seed = useMemo(() => scenarioSeed(scenario), [scenario]);
  return <ExerciseProvider><MealRecordsProvider additionalRecords={createUserTrainerMeals({ waiting: scenario === "meal" })}><UserTrainerProvider initialSeed={seed}>
    <PreviewFlow scenario={scenario} onClose={onClose} />
  </UserTrainerProvider></MealRecordsProvider></ExerciseProvider>;
}
export default function UserTrainerPreview() {
  const params = useLocalSearchParams();
  const [scenario, setScenario] = useState(null);
  useEffect(() => {
    if (userTrainerScenarios.some((item) => item[2] === params.userTrainerScenario)) setScenario(params.userTrainerScenario);
  }, [params.userTrainerScenario]);
  const insets = useSafeAreaInsets();
  return <View className="gap-2">
    <Text className="text-12 text-grayscale-G600">26개 상태 · 각 미리보기는 실제 화면 데이터와 분리됩니다.</Text>
    {userTrainerScenarios.map(([id, label, key]) => <Pressable key={id} accessibilityRole="button" accessibilityLabel={`회원 트레이너 미리보기 ${label}`}
      onPress={() => setScenario(key)} className="rounded-lg bg-white px-3 py-2.5">
      <Text className="text-14 font-pretendard-medium text-text">{label}</Text><Text className="text-12 text-grayscale-G500">{id}</Text>
    </Pressable>)}
    <Modal visible={scenario !== null} animationType="slide" onRequestClose={() => setScenario(null)}>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <Pressable accessibilityRole="button" accessibilityLabel="회원 트레이너 미리보기 닫기" onPress={() => setScenario(null)} className="border-b border-grayscale-G100 px-4 py-2">
          <Text className="text-12 font-pretendard-semibold text-primary-main">미리보기 닫기</Text>
        </Pressable>
        <SafeAreaInsetsContext.Provider value={{ ...insets, top: 0 }}>
          {scenario && <PreviewProvider key={scenario} scenario={scenario} onClose={() => setScenario(null)} />}
        </SafeAreaInsetsContext.Provider>
      </SafeAreaView>
    </Modal>
  </View>;
}
