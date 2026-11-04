import ConfirmCheck from "@/assets/figma/pt-confirm-check.svg";
import Button from "@/components/button";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/tailwind.config";

export default function ExerciseRecordCard({
  type = "exercise",
  title,
  time,
  location,
  exerciseCount = 0,
  sessionLabel,
  showConfirmation = false,
  memberConfirmed = false,
  trainerConfirmed = false,
  onPress,
  onConfirm,
  className = "",
}) {
  const pt = type === "pt";
  return (
    <View
      className={`w-full gap-3 rounded-lg bg-white p-3 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.1)] ${className}`}
    >
      <Pressable
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={`${title} 상세 보기`}
        onPress={onPress}
        disabled={!onPress}
        className="gap-3"
      >
        <View className="flex-row flex-wrap items-center gap-2">
          <Text
            numberOfLines={1}
            className="max-w-full shrink text-16 font-pretendard-semibold text-text"
          >
            {title}
          </Text>
          <View
            className={`rounded-full px-2 py-0.5 ${
              pt ? "bg-secondary-blue/20" : "bg-primary-50"
            }`}
          >
            <Text
              className={`text-12 font-pretendard-semibold ${
                pt ? "text-secondary-blue" : "text-primary-main"
              }`}
            >
              {pt ? "PT" : "운동"}
            </Text>
          </View>
          {pt && !!sessionLabel && (
            <Text className="ml-auto text-12 font-pretendard-semibold text-secondary-blue">
              {sessionLabel}
            </Text>
          )}
        </View>
        <View className="gap-1">
          {[
            ["시간", time],
            ...(pt ? [["장소", location]] : []),
            ["종목", `${exerciseCount}종목`],
          ]
            .filter(([, value]) => !!value)
            .map(([label, value]) => (
              <View key={label} className="flex-row items-start gap-2">
                <Text className="text-12 font-pretendard-regular text-grayscale-G500">
                  {label}
                </Text>
                <Text className="shrink text-12 font-pretendard-semibold text-grayscale-G800">
                  {value}
                </Text>
              </View>
            ))}
        </View>
      </Pressable>
      {pt && showConfirmation && (
        <View className="gap-3 border-t border-grayscale-G100 pt-3">
          <View className="gap-1">
            {[
              ["나", memberConfirmed],
              ["트레이너", trainerConfirmed],
            ].map(([label, confirmed]) => (
              <View
                key={label}
                className="flex-row items-center justify-between"
              >
                <Text className="text-14 font-pretendard-semibold text-text">
                  {label}
                </Text>
                <View className="flex-row items-center gap-1">
                  {confirmed && <ConfirmCheck />}
                  <Text
                    className={`text-12 ${
                      confirmed
                        ? "font-pretendard-semibold text-text"
                        : "font-pretendard-regular text-grayscale-G400"
                    }`}
                  >
                    {confirmed ? "확인 완료" : "확인 전"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {!memberConfirmed && (
            <Button
              text="PT 확인 완료"
              variant="weakDark"
              style={{ backgroundColor: colors.grayscale.G50 }}
              accessibilityRole="button"
              disabled={!onConfirm}
              onPress={onConfirm}
            />
          )}
        </View>
      )}
    </View>
  );
}
