import More from "@/assets/figma/more.svg";
import { Pressable, Text, View } from "react-native";

export default function Routine({
  routineName = "루틴 이름",
  trainer = true,
  exerciseCount = 5,
  onPress,
  onPressMore,
  className = "",
}) {
  return (
    <View
      className={`w-full min-h-[66px] flex-row items-start justify-between rounded-lg bg-white p-3 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1)] ${className}`}
    >
      <Pressable
        disabled={!onPress}
        onPress={onPress}
        accessibilityRole={onPress ? "button" : undefined}
        className="min-w-0 flex-1 gap-0.5"
      >
        <View className="min-h-[22px] flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="shrink text-14 font-pretendard-semibold text-text"
          >
            {routineName}
          </Text>
          {trainer && (
            <View className="rounded-md bg-secondary-blue/10 px-2 py-0.5">
              <Text className="text-12 font-pretendard-semibold text-secondary-blue">
                트레이너 지정
              </Text>
            </View>
          )}
        </View>
        <Text className="text-12 font-pretendard-regular text-grayscale-G500">
          {exerciseCount}개의 운동
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="루틴 더 보기"
        hitSlop={8}
        onPress={onPressMore}
      >
        <More />
      </Pressable>
    </View>
  );
}
