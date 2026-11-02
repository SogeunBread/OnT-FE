import PreviousTimeLine from "@/assets/figma/pt-previous-time-line.svg";
import Button from "@/components/button";
import { colors } from "@/tailwind.config";
import { Text, View } from "react-native";

const TITLES = {
  create: "PT 일정이 등록되었어요 💪",
  update: "PT 일정이 수정되었어요.",
  delete: "PT 일정이 취소되었어요.",
};

export default function ChatPT({
  variant = "create",
  lesson = "_회차",
  time = "_월 _일 00:00-00:00",
  previousTime,
  onPress,
  disabled = false,
  className = "",
}) {
  return (
    <View
      className={`w-[280px] max-w-full gap-2 overflow-hidden rounded-xl border border-grayscale-G50 bg-white p-3 ${className}`}
    >
      <View className="gap-3">
        <View className="border-b border-grayscale-G50 pb-3">
          <Text className="text-16 font-pretendard-semibold text-text">
            {TITLES[variant] ?? TITLES.create}
          </Text>
        </View>
        <View className="gap-1">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="text-12 font-pretendard-regular text-grayscale-G400">
              회차
            </Text>
            <Text className="shrink text-right text-12 font-pretendard-medium text-text">
              {lesson}
            </Text>
          </View>
          <View className="flex-row items-start justify-between gap-3">
            <Text className="text-12 font-pretendard-regular text-grayscale-G400">
              시간
            </Text>
            <View className="min-w-0 shrink items-end">
              {variant === "update" && !!previousTime && (
                <View className="max-w-full overflow-hidden">
                  <Text
                    accessibilityLabel={`변경 전 ${previousTime}`}
                    className="text-right text-12 font-pretendard-medium text-grayscale-G200"
                  >
                    {previousTime}
                  </Text>
                  <View
                    pointerEvents="none"
                    accessible={false}
                    className="absolute left-0 top-1/2"
                  >
                    <PreviousTimeLine />
                  </View>
                </View>
              )}
              <Text
                accessibilityLabel={`${
                  variant === "update" ? "변경 후 " : ""
                }${time}`}
                className="text-right text-12 font-pretendard-medium text-text"
              >
                {time}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {variant !== "delete" && (
        <Button
          text="일정 자세히보기"
          textClassName="text-12"
          variant="weakDark"
          className="w-full"
          style={{
            paddingVertical: 8,
            ...(!disabled && { backgroundColor: colors.grayscale.G50 }),
          }}
          accessibilityRole="button"
          onPress={onPress}
          disabled={disabled}
        />
      )}
    </View>
  );
}
