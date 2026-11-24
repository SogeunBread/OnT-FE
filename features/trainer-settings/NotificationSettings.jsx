import HeaderDetail from "@/components/header_detail";
import List from "@/components/list";
import Toggle from "@/components/toggle";
import { trainerNotificationOptions } from "@/constants/trainerSettings";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// showAppOptions preserves the two earlier app-settings designs for development preview.
export default function NotificationSettings({ value, onChange, onBack, showAppOptions = false }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white">
      <HeaderDetail title={showAppOptions ? "앱 설정" : "알림 설정"} subtitle="" actionType="none" onPressBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 34) }}>
        {showAppOptions ? (
          <View className="border-b-[8px] border-grayscale-G100/40">
            <List title="다크모드" subtitle="어두운 화면으로 눈의 피로도를 낮춰보세요!" variant="toggle" value={false} disabled className="border-b-0" />
          </View>
        ) : null}
        {trainerNotificationOptions.map(({ key, title, subtitle }) => {
          const disabled = key !== "push" && !value.push;
          return disabled ? (
            <View key={key} className="min-h-[63px] w-full flex-row items-center gap-6 border-b border-grayscale-G100 bg-grayscale-G100/40 px-4 py-3">
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} className="text-14 font-pretendard-semibold text-grayscale-G400">{title}</Text>
                <Text numberOfLines={1} className="text-12 font-pretendard-regular text-grayscale-G200">{subtitle}</Text>
              </View>
              <Toggle accessibilityLabel={title} value={false} disabled className="!opacity-100" />
            </View>
          ) : (
            <List key={key} title={title} subtitle={subtitle} variant="toggle" value={value[key]} onValueChange={(next) => onChange?.(key, next)} />
          );
        })}
      </ScrollView>
    </View>
  );
}
