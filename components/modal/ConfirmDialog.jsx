import { Modal as NativeModal, Pressable, View } from "react-native";
import Modal from "./Modal";

export default function ConfirmDialog({
  visible = false,
  title,
  content,
  icon,
  confirmText = "확인",
  cancelText = "아니오",
  cancelVariant = "weak",
  onConfirm,
  onCancel,
  busy = false,
}) {
  const dismiss = () => {
    if (!busy) onCancel?.();
  };
  return (
    <NativeModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismiss}
    >
      <View className="flex-1 items-center justify-center px-4">
        <Pressable
          accessibilityLabel="팝업 닫기"
          accessibilityRole="button"
          onPress={dismiss}
          className="absolute inset-0 bg-text/20"
        />
        <Modal
          title={title}
          content={content}
          icon={icon}
          className="max-w-full"
          accessibilityLabel={title}
          leftButtonVariant={cancelVariant}
          leftButtonText={cancelText}
          rightButtonText={confirmText}
          onLeftPress={dismiss}
          onRightPress={onConfirm}
          buttonsDisabled={busy}
        />
      </View>
    </NativeModal>
  );
}
