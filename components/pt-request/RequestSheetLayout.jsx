import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Shared sheet presentation; account-specific actions stay with callers.
export default function ChatSheet({
  visible = true,
  label,
  children,
  footer,
  onClose,
  onBack = onClose,
}) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

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
        behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} 닫기`}
          className="absolute inset-0 bg-text/20"
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          accessibilityLabel={label}
          onAccessibilityEscape={onBack}
          className="shrink rounded-t-[20px] bg-white pt-3"
          style={{ maxHeight: Math.max(1, height - Math.max(insets.top, 16)) }}
        >
          <View className="mx-auto mb-5 h-1 w-[60px] rounded-sm bg-grayscale-G100" />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ flexShrink: 1, flexGrow: 0 }}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {children}
          </ScrollView>
          {!!footer && <View className="px-4 pt-[22px] pb-2.5">{footer}</View>}
          <View style={{ height: Math.max(insets.bottom, 34) }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
