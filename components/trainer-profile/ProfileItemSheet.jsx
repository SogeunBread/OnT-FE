import Button from "@/components/button";
import { useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ItemLabel({ children, required = true }) {
  return (
    <Text className="text-14 font-pretendard-semibold text-text">
      {children}{required && <Text className="text-primary-main"> *</Text>}
    </Text>
  );
}

export default function ProfileItemSheet({
  visible = true,
  title,
  children,
  disabled,
  onBack,
  onSave,
}) {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (visible) Keyboard.dismiss();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onBack}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title} 닫기`}
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(17,17,17,0.2)" }}
          onPress={onBack}
        />
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onBack}
          className="max-h-[90%] rounded-t-[20px] bg-white pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 34) }}
        >
          <View className="mx-auto mb-5 h-1 w-[60px] rounded-sm bg-grayscale-G100" />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <Text accessibilityRole="header" className="mb-5 text-16 font-pretendard-semibold text-text">
              {title}
            </Text>
            <View className="gap-4">{children}</View>
          </ScrollView>
          <View className="px-4 pb-2.5 pt-[22px]">
            <Button
              text="추가하기"
              variant="fill"
              disabled={disabled}
              accessibilityRole="button"
              onPress={onSave}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
