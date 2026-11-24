import { Pressable, Text, View } from "react-native";

export default function UpcomingLessonCard({ lesson, onPress }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="예정된 PT 수업 상세 보기" onPress={onPress}
    className="flex-row items-center gap-3 rounded-lg border border-grayscale-G100 p-2">
    <View className="items-center rounded-lg bg-grayscale-G50 px-2 py-2">
      <Text className="text-12 font-pretendard-medium text-grayscale-G700">{lesson.dateLabel}</Text>
      <Text className="text-18 font-pretendard-bold text-primary-main">{lesson.startTime}</Text>
      <Text className="text-12 font-pretendard-regular text-grayscale-G700">-{lesson.endTime}</Text>
    </View>
    <View className="min-w-0 flex-1 gap-3">
      <Text className="text-16 font-pretendard-semibold text-text">{lesson.trainerName}</Text>
      <View className="gap-1">{[["장소", lesson.location], ["종목", `${lesson.exerciseCount}종목`]].map(([label, value]) => <View key={label} className="flex-row gap-2">
        <Text className="text-12 font-pretendard-regular text-grayscale-G500">{label}</Text>
        <Text className="shrink text-12 font-pretendard-semibold text-grayscale-G800">{value}</Text>
      </View>)}</View>
    </View>
  </Pressable>;
}
