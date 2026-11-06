import Tag from "@/components/tag";
import { Text, View } from "react-native";

export default function PTScheduleCard({
  memberName,
  currentSession,
  totalSessions,
  startTime,
  endTime,
  location,
  exerciseCount,
}) {
  const details = [
    { label: "시간", value: `${startTime}-${endTime}` },
    { label: "장소", value: location },
    { label: "종목", value: `${exerciseCount}종목` },
  ];

  return (
    <View className="w-full gap-3 rounded-lg bg-white p-3 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1)]">
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="shrink text-16 font-pretendard-semibold text-text"
          >
            {memberName} 회원
          </Text>
          <Tag text="PT" variant="filled" className="self-center" />
        </View>
        <Text className="text-12 font-pretendard-semibold text-secondary-blue">
          {currentSession} / {totalSessions}회차
        </Text>
      </View>
      <View className="gap-1">
        {details.map(({ label, value }) => (
          <View key={label} className="flex-row items-start gap-2">
            <Text className="text-12 font-pretendard-regular text-grayscale-G500">
              {label}
            </Text>
            <Text className="min-w-0 flex-1 text-12 font-pretendard-semibold text-grayscale-G800">
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
