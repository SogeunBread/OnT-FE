import { Text, View } from "react-native";

export default function PTProgressSummary({ summary: member, className = "" }) {
  return (
<View className={`gap-3 ${className}`}>
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
  );
}
