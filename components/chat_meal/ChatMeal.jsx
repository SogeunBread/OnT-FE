import Button from "@/components/button";
import { colors } from "@/tailwind.config";
import { Text, View } from "react-native";

export default function ChatMeal({
  from = "user",
  date = "",
  photoCount = 0,
  title,
  description,
  onPress,
  disabled = false,
  className = "",
}) {
  const isTrainer = from === "trainer";
  const heading =
    title ??
    (isTrainer
      ? "식단 피드백을 보냈어요 ☘️"
      : "식단 피드백 요청이 도착했어요 🥗");
  const body =
    description ??
    (isTrainer
      ? "식단에 대한 피드백을 보냈어요.\n확인해보세요!"
      : `${
          photoCount > 0 ? `사진 ${photoCount}장이 포함된 식단을` : "식단을"
        } 업로드했어요.\n피드백 부탁드려요!`);
  return (
    <View
      className={`w-[280px] max-w-full gap-2 rounded-xl border border-grayscale-G50 bg-white p-3 ${className}`}
    >
      <View className="gap-8">
        <View>
          {!!date && (
            <Text className="text-12 font-pretendard-regular text-text">
              {date}
            </Text>
          )}
          <Text className="text-16 font-pretendard-semibold text-text">
            {heading}
          </Text>
        </View>
        <Text className="text-14 font-pretendard-regular text-text">
          {body}
        </Text>
      </View>
      <Button
        text="식단 확인하기"
        textClassName="text-12"
        variant="weakDark"
        className="w-full"
        style={{
          paddingVertical: 8,
          ...(!disabled && { backgroundColor: colors.grayscale.G50 }),
        }}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
      />
    </View>
  );
}
