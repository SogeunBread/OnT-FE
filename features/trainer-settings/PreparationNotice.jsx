import { Modal, Pressable, Text, View } from "react-native";
import Button from "@/components/button";

export default function PreparationNotice({ title, onClose }) {
  return (
    <Modal visible={Boolean(title)} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-4">
        <Pressable accessibilityRole="button" accessibilityLabel="안내 닫기" onPress={onClose} className="absolute inset-0 bg-text/20" />
        <View accessibilityViewIsModal className="w-full max-w-[358px] gap-4 rounded-xl bg-white p-4">
          <Text className="text-center text-18 font-pretendard-bold text-text">{title}</Text>
          <Text className="text-center text-14 font-pretendard-regular text-grayscale-G600">준비 중인 기능이에요.</Text>
          <Button text="확인" accessibilityRole="button" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
