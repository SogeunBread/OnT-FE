import MealIcon from "@/assets/figma/chat-member-meal.svg";
import SendIcon from "@/assets/figma/chat-member-send.svg";
import TrainerIcon from "@/assets/figma/chat-member-trainer.svg";
import ManageIcon from "@/assets/figma/chat-member-manage.svg";
import RightIcon from "@/assets/figma/chat-member-right.svg";
import Button from "@/components/button";
import Sheet from "@/components/exercise/Sheet";
import HeaderDetail from "@/components/header_detail";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrainerChat } from "./TrainerChatProvider";

const MEMBER_TOOLS = [
  {
    key: "meal",
    title: "식단 캘린더",
    description: "회원이 요청한 식단 피드백을 빠르게 확인해보세요.",
    Icon: MealIcon,
  },
  {
    key: "routine",
    title: "루틴 배포하기",
    description: "내가 제공한 루틴 이행률을 확인해보세요.",
    Icon: SendIcon,
  },
  {
    key: "exercise",
    title: "회원 운동 일지",
    description: "PT 일정을 잡고 운동한 기록을 확인해보세요.",
    Icon: TrainerIcon,
  },
  {
    key: "weight",
    title: "체중 그래프",
    description: "회원의 체중 변화를 직접 확인해보세요.",
    Icon: ManageIcon,
  },
];

function MemberTool({ tool, onPress }) {
  const { Icon } = tool;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tool.title}
      onPress={onPress}
      className="min-h-[133px] min-w-0 flex-1 gap-3 rounded-lg border border-grayscale-G50 bg-white p-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-50/70">
          <View className="h-6 w-6 items-center justify-center">
            <Icon />
          </View>
        </View>
        <RightIcon />
      </View>
      <View className={tool.key === "meal" ? "gap-0.5" : "gap-1"}>
        <Text className="text-14 font-pretendard-semibold text-text">
          {tool.title}
        </Text>
        <Text className="text-12 font-pretendard-regular text-grayscale-G600">
          {tool.description}
        </Text>
      </View>
    </Pressable>
  );
}

export function MemberDetailView({
  room,
  onBack: goBack,
  onChat: openChat,
  onOpenMealCalendar,
  onDistributeRoutine,
  onOpenExerciseJournal,
  onOpenWeightGraph,
}) {
  const insets = useSafeAreaInsets();
  const [unavailableTool, setUnavailableTool] = useState(null);
  const member = room?.member;

  const callbacks = {
    meal: onOpenMealCalendar,
    routine: onDistributeRoutine,
    exercise: onOpenExerciseJournal,
    weight: onOpenWeightGraph,
  };
  const openTool = (tool) => {
    const callback = callbacks[tool.key];
    if (callback) callback(room);
    else setUnavailableTool(tool);
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderDetail
        title="회원 상세보기"
        subtitle=""
        actionType="none"
        onPressBack={goBack}
      />
      {!room || !member ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-14 font-pretendard-regular text-grayscale-G500">
            회원 정보를 찾을 수 없어요.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-[60px] w-[60px] overflow-hidden rounded-lg bg-grayscale-G50">
                {!!room.avatarSource && (
                  <Image
                    source={typeof room.avatarSource === "string" ? { uri: room.avatarSource } : room.avatarSource}
                    accessibilityLabel={`${room.memberName} 회원 프로필 사진`}
                    className="h-[60px] w-[60px]"
                  />
                )}
              </View>
              <View className="min-w-0 flex-1 gap-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="text-18 font-pretendard-bold text-text">
                    {room.memberName} 회원
                  </Text>
                  <View className="rounded-full bg-primary-50 px-2 py-0.5">
                    <Text className="text-12 font-pretendard-semibold text-primary-main">
                      PT 진행 중
                    </Text>
                  </View>
                </View>
                <Text className="text-12 font-pretendard-medium text-grayscale-G500">
                  {[member.gender, member.age != null ? `${member.age}세` : null].filter(Boolean).join("・")}
                </Text>
              </View>
            </View>
            <View className="mt-2 gap-3">
              <View className="gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-12 font-pretendard-medium text-grayscale-G600">
                    PT 진행률
                  </Text>
                  <Text className="text-18 font-pretendard-bold text-text">
                    {member.progress}%
                  </Text>
                </View>
                <View
                  accessibilityRole="progressbar"
                  accessibilityValue={{ min: 0, max: 100, now: member.progress }}
                  className="h-2 overflow-hidden rounded-lg bg-grayscale-G50"
                >
                  <View
                    className="h-2 rounded-lg bg-primary-main"
                    style={{ width: `${Math.max(0, Math.min(100, member.progress))}%` }}
                  />
                </View>
              </View>
              <View className="h-[66px] flex-row items-center rounded-lg bg-grayscale-G100/30 py-3">
                {[
                  ["전체 PT 횟수", member.totalPT],
                  ["완료된 PT", member.completedPT],
                  ["남은 PT", Math.max(0, member.totalPT - member.completedPT)],
                ].map(([label, value], index) => (
                  <View
                    key={label}
                    className={`min-w-0 flex-1 items-center ${index < 2 ? "border-r border-grayscale-G100" : ""}`}
                  >
                    <Text className="text-12 font-pretendard-medium text-grayscale-G600">
                      {label}
                    </Text>
                    <Text className="text-16 font-pretendard-semibold text-text">
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="mt-4 gap-2">
              {[MEMBER_TOOLS.slice(0, 2), MEMBER_TOOLS.slice(2)].map((row, index) => (
                <View key={index} className="flex-row items-stretch gap-2">
                  {row.map((tool) => (
                    <MemberTool key={tool.key} tool={tool} onPress={() => openTool(tool)} />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
          <View
            className="border-t border-grayscale-G100 px-4 pt-2.5"
            style={{ paddingBottom: Math.max(insets.bottom, 34) + 10 }}
          >
            <Button
              text="채팅하기"
              variant="fill"
              accessibilityRole="button"
              onPress={openChat}
            />
          </View>
        </>
      )}
      <Sheet
        visible={!!unavailableTool}
        accessibilityLabel={unavailableTool?.title}
        onClose={() => setUnavailableTool(null)}
        initialHeight={230}
        header={
          <Text className="text-18 font-pretendard-bold text-text">
            {unavailableTool?.title}
          </Text>
        }
        footer={
          <Button
            text="확인"
            variant="fill"
            accessibilityRole="button"
            onPress={() => setUnavailableTool(null)}
          />
        }
      >
        <Text className="text-14 font-pretendard-regular text-grayscale-G600">
          아직 제공되지 않는 기능이에요.
        </Text>
      </Sheet>
    </View>
  );
}

export default function MemberDetailScreen(props) {
  const router = useRouter();
  const { memberId, from } = useLocalSearchParams();
  const { rooms } = useTrainerChat();
  const room = memberId
    ? rooms.find((item) => item.id === memberId)
    : rooms.find((item) => item.category === "member");
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(trainerTabs)/manage");
  };
  const openChat = () => {
    if (from === "chat" && router.canGoBack()) router.back();
    else router.push({ pathname: "/(trainer)/chat/[id]", params: { id: room.id } });
  };
  return <MemberDetailView {...props} room={room} onBack={goBack} onChat={openChat} />;
}
