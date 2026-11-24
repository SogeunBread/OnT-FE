import AcceptedCheck from "@/assets/figma/chat-accepted-check.svg";
import AcceptedConfetti from "@/assets/figma/chat-accepted-confetti.svg";
import RequestRight from "@/assets/figma/chat-request-right.svg";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

function lessonLabel(value) {
  if (value === undefined || value === null || value === "") return "—";
  return /^\d+$/.test(String(value)) ? `${value}회` : String(value);
}

function RequestSummary({ request }) {
  const rows = [
    ["헬스장", request?.gymName],
    ["트레이너", request?.trainerName],
    ["횟수", lessonLabel(request?.lessonCount)],
  ];
  return (
    <View className="w-full gap-1">
      {rows.map(([label, value]) => (
        <View key={label} className="flex-row items-start justify-between gap-3">
          <Text className="text-12 font-pretendard-regular text-grayscale-G400">
            {label}
          </Text>
          <Text className="min-w-0 shrink text-right text-12 font-pretendard-medium text-text">
            {value || "—"}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function RequestCard({ request, onPress }) {
  return (
    <View className="w-[320px] max-w-full overflow-hidden rounded-xl border border-grayscale-G50 bg-white">
      <View className="gap-6 border-b border-grayscale-G50 px-4 py-3">
        <View className="gap-0.5">
          <Text className="text-18 font-pretendard-bold text-text">PT 수업 요청</Text>
          <Text className="text-14 font-pretendard-regular text-grayscale-G600">
            트레이너가 요청을 확인한 후 수락 여부를 결정해요.
          </Text>
        </View>
        <RequestSummary request={request} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="요청 정보 확인"
        onPress={onPress}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <Text className="text-14 font-pretendard-semibold text-primary-main">
          요청 정보 확인
        </Text>
        <RequestRight />
      </Pressable>
    </View>
  );
}

export function AcceptedCard({ request }) {
  const [width, setWidth] = useState(320);
  return (
    <View
      className="w-[320px] max-w-full overflow-hidden rounded-xl bg-white"
      onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
    >
      <View className="items-center gap-5 bg-primary-main pt-5 pb-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
          <AcceptedCheck />
        </View>
        <Text className="text-center text-18 font-pretendard-bold text-white">
          PT 수업이 시작되었어요!
        </Text>
        <View
          pointerEvents="none"
          accessible={false}
          className="absolute top-[17px]"
          style={{ left: Math.min(25, Math.max(0, width - 283.572)) }}
        >
          <AcceptedConfetti />
        </View>
      </View>
      <View className="rounded-b-xl border-x border-b border-grayscale-G50 px-4 py-3">
        <RequestSummary request={request} />
      </View>
    </View>
  );
}

export function RejectedCard({ reason, title = "PT 수업 요청이 거절되었어요.", reasonLabel = "거절 사유" }) {
  return (
    <View className="w-[320px] max-w-full overflow-hidden rounded-xl border border-grayscale-G50 bg-white px-4">
      <View className="border-b border-grayscale-G50 py-3">
        <Text className="text-14 font-pretendard-semibold text-text">
          {title}
        </Text>
      </View>
      <View className="gap-1 py-3">
        {!!reasonLabel && <Text className="text-12 font-pretendard-regular text-grayscale-G400">
          {reasonLabel}
        </Text>}
        <Text className="text-12 font-pretendard-semibold text-grayscale-G700">
          {reason}
        </Text>
      </View>
    </View>
  );
}
