import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import HeaderDetail from "@/components/header_detail";
import Button from "@/components/button";
import { exerciseRoutes } from "./navigation";

export default function FlowScaffold({
  title,
  onBack,
  children,
  footer,
  keyboard = false,
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      <HeaderDetail
        title={title}
        subtitle=""
        actionType="none"
        includeSafeArea={false}
        onPressBack={
          onBack ??
          (() =>
            router.canGoBack()
              ? router.back()
              : router.replace(exerciseRoutes.home))
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboard && Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="min-h-0 flex-1">{children}</View>
        {!!footer && (
          <View
            className="border-t border-grayscale-G100 bg-white px-4 pt-2.5"
            style={{ paddingBottom: Math.max(insets.bottom, 10) }}
          >
            {footer}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function FlowMessage({ message, onBack }) {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center gap-5 px-4">
      <Text className="text-center text-14 font-pretendard-regular text-grayscale-G600">
        {message}
      </Text>
      {onBack !== false && (
        <Button
          text="돌아가기"
          accessibilityRole="button"
          onPress={onBack ?? (() => router.replace(exerciseRoutes.home))}
        />
      )}
    </View>
  );
}
