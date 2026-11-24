import { useState } from "react";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import Tab from "@/components/tab";
import Tag from "@/components/tag";
import Button from "@/components/button";
import ChatList from "@/components/chat_list";
import PTProgressSummary from "@/components/pt-request/PTProgressSummary";
import { useUserTrainer } from "./UserTrainerProvider";
import { listTime, previewMessage } from "./state";
import UpcomingLessonCard from "./UpcomingLessonCard";
import RecordDetails from "./RecordDetails";

export function TrainerTabView({ state, onTab, onChat, onLesson }) {
  const matched = state.rooms.find((room) => room.matched);
  const trainer = matched?.trainer;
  const showCurrent = matched && state.selectedTab === "current";
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return <View className="flex-1 bg-white">
    {matched && <View className="flex-row">
      <Tab text="내 트레이너" selected={state.selectedTab === "current"} onPress={() => onTab("current")} className="h-[45px] justify-center !py-0" style={{ flex: 1, width: "auto" }} />
      <Tab text="이전 채팅" selected={state.selectedTab === "previous"} onPress={() => onTab("previous")} className="h-[45px] justify-center !py-0" style={{ flex: 1, width: "auto" }} />
    </View>}
    {!state.ready ? <Text className="p-5 text-center text-14 text-grayscale-G500">불러오는 중입니다.</Text> : showCurrent ?
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
        <View className="flex-row items-center gap-3">
          <View className="h-[60px] w-[60px] overflow-hidden rounded-lg bg-grayscale-G50">{trainer.avatarSource && <Image source={trainer.avatarSource} className="h-full w-full" />}</View>
          <View className="min-w-0 flex-1 gap-1"><View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-18 font-pretendard-bold text-text">{trainer.name}</Text>
            <View className="rounded-full bg-primary-50 px-2 py-0.5"><Text className="text-12 font-pretendard-semibold text-primary-main">PT 진행 중</Text></View>
          </View><Text className="text-12 font-pretendard-regular text-grayscale-G500">{trainer.gender}・{trainer.age}세</Text></View>
        </View>
        <View className="flex-row flex-wrap gap-1.5">{trainer.specialties.map((text) => <Tag key={text} text={text} />)}</View>
        <PTProgressSummary summary={trainer} />
        <Button text="채팅하기" variant="fill" accessibilityRole="button" onPress={() => onChat(matched.id)} />
        {matched.upcoming && <View className="gap-2"><Text className="text-16 font-pretendard-semibold text-text">예정된 수업</Text>
          <UpcomingLessonCard lesson={{ dateLabel: "4월 13일 (목)", startTime: "15:00", endTime: "16:00", trainerName: trainer.name, location: "다짐 헬스장", exerciseCount: 6 }} onPress={() => onLesson("user-trainer-lesson")} />
        </View>}
        <View className="gap-2"><Text className="text-16 font-pretendard-semibold text-text">수업 위치</Text>
          <View className="flex-row items-center gap-2.5 rounded-lg border border-grayscale-G100 p-2"><View className="h-12 w-12 rounded bg-grayscale-G100" />
            <View className="min-w-0 flex-1"><Text className="text-14 font-pretendard-semibold text-text">{trainer.gymName}</Text><Text className="text-12 font-pretendard-regular text-grayscale-G500">{trainer.address}</Text></View>
          </View>
        </View>
      </ScrollView> : <ScrollView>
        {state.rooms.filter((room) => !room.matched).map((room) => <ChatList key={room.id} name={room.trainer.name} message={previewMessage(room.messages.at(-1))}
          time={listTime(room.messages.at(-1), today)} unreadCount={room.unreadCount} avatarSource={room.trainer.avatarSource} onPress={() => onChat(room.id)} />)}
        {!state.rooms.some((room) => !room.matched) && <Text className="p-8 text-center text-14 text-grayscale-G500">아직 채팅이 없어요.</Text>}
      </ScrollView>}
  </View>;
}
export default function TrainerTabScreen() {
  const router = useRouter();
  const { state, send } = useUserTrainer();
  const [lessonId, setLessonId] = useState(null);
  return <>
    <TrainerTabView state={state} onTab={(tab) => send({ type: "tab", tab })}
      onChat={(id) => router.push({ pathname: "/(userTrainerFlow)/trainer-chat/[id]", params: { id } })} onLesson={setLessonId} />
    <RecordDetails detail={lessonId ? { kind: "pt", id: lessonId } : null} onClose={() => setLessonId(null)} />
  </>;
}
