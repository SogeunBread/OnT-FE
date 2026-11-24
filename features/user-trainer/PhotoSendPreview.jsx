import Back from "@/assets/figma/user-chat-preview-back.svg";
import { useRef, useState } from "react";
import { Image, Modal, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PhotoSendPreview({ photo, onClose, onSend }) {
  const insets = useSafeAreaInsets();
  const [failed, setFailed] = useState(false);
  const [sending, setSending] = useState(false);
  const submitted = useRef(false);
  return <Modal visible animationType="fade" onRequestClose={onClose}>
    <StatusBar barStyle="light-content" />
    <View accessibilityViewIsModal className="flex-1 bg-text" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="h-[70px] flex-row items-center justify-between px-4">
        <Pressable accessibilityRole="button" accessibilityLabel="사진 전송 취소" hitSlop={12} onPress={onClose}><Back /></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="선택한 사진 전송" hitSlop={12} disabled={failed || sending}
          onPress={() => { if (submitted.current) return; submitted.current = true; setSending(true); onSend(photo); }}>
          <Text className={`text-18 font-pretendard-bold text-white ${failed || sending ? "opacity-50" : ""}`}>전송</Text>
        </Pressable>
      </View>
      {failed ? <View className="flex-1 items-center justify-center"><Text className="text-14 text-white">사진을 불러올 수 없어요.</Text></View> :
        <Image accessibilityLabel="전송할 사진" source={photo.source ?? { uri: photo.uri }} resizeMode="contain" className="w-full flex-1" onError={() => setFailed(true)} />}
    </View>
  </Modal>;
}
