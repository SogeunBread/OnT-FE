import PhotoIcon from "@/assets/figma/chat-photo.svg";
import SendIcon from "@/assets/figma/chat-send.svg";
import ButtonIcon from "@/components/button_icon";
import Chat from "@/components/chat";
import Field from "@/components/field";
import HeaderDetail from "@/components/header_detail";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RequestSheet from "./RequestSheet";
import { AcceptedCard, RejectedCard, RequestCard } from "./RequestCards";
import { canGroupMessages } from "./state";

function formatDay(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

function PhotoViewer({ message, onClose }) {
  const insets = useSafeAreaInsets();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const close = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View accessibilityViewIsModal className="flex-1 bg-text" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Pressable accessibilityRole="button" accessibilityLabel="사진 닫기" onPress={onClose} className="self-end px-5 py-4">
          <Text className="text-16 font-pretendard-semibold text-white">닫기</Text>
        </Pressable>
        {failed ? <View className="flex-1 items-center justify-center">
          <Text className="text-14 font-pretendard-regular text-white">사진을 불러올 수 없어요.</Text>
        </View> : <Image accessibilityLabel="채팅 사진 크게 보기" source={message.imageSource}
          className="w-full flex-1" resizeMode="contain" onError={() => setFailed(true)} />}
      </View>
    </Modal>
  );
}

export default function ChatRoom({
  room, onBack, onManage, onSendText, onSendPhoto, onAccept, onReject,
  initialRequestStep, initialRequestReason,
}) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState("");
  const [requestOpen, setRequestOpen] = useState(!!initialRequestStep);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [picking, setPicking] = useState(false);
  const active = useRef(true);
  const pickerBusy = useRef(false);
  const scroll = useRef(null);
  const followEnd = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const scrollToEnd = () => { if (followEnd.current) scroll.current?.scrollToEnd({ animated: false }); };

  const openRequest = () => { Keyboard.dismiss(); setRequestOpen(true); };
  const send = () => {
    if (!draft.trim()) return;
    followEnd.current = true;
    onSendText?.(draft.trim());
    setDraft("");
  };
  const pickPhoto = async () => {
    if (pickerBusy.current) return;
    pickerBusy.current = true;
    setPicking(true);
    setPhotoError("");
    try {
      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!active.current) return;
        if (!permission.granted) { setPhotoError("사진을 보내려면 사진 접근 권한을 허용해주세요."); return; }
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1, exif: false });
      if (!active.current) {
        if (Platform.OS === "web") result.assets?.forEach((asset) => {
          if (asset.uri?.startsWith("blob:")) URL.revokeObjectURL(asset.uri);
        });
        return;
      }
      if (result.canceled) return;
      const selected = result.assets?.[0];
      if (!selected?.uri || !(selected.width > 0 && selected.height > 0)) {
        setPhotoError("사진을 불러오지 못했어요. 다시 선택해주세요.");
        if (Platform.OS === "web" && selected?.uri?.startsWith("blob:")) URL.revokeObjectURL(selected.uri);
        return;
      }
      followEnd.current = true;
      onSendPhoto?.(selected);
    } catch {
      if (active.current) setPhotoError("사진을 불러오지 못했어요. 다시 선택해주세요.");
    } finally {
      pickerBusy.current = false;
      if (active.current) setPicking(false);
    }
  };
  const hasRequest = !!room?.request;
  return (
    <View className="flex-1 bg-white">
      <HeaderDetail title={room ? `${room.memberName} 회원` : "채팅"} subtitle=""
        actionType={room ? "button" : "none"} buttonLabel={hasRequest ? "요청서 확인" : "관리"}
        onPressBack={onBack} onPressAction={hasRequest ? openRequest : onManage} />
      {!room ? <View className="flex-1 items-center justify-center px-4">
        <Text className="text-14 font-pretendard-regular text-grayscale-G500">채팅방을 찾을 수 없어요.</Text>
      </View> : (
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}>
          <ScrollView ref={scroll} className="flex-1" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false} onLayout={scrollToEnd} onContentSizeChange={scrollToEnd}
            onScroll={({ nativeEvent: event }) => { followEnd.current = event.contentSize.height - event.layoutMeasurement.height - event.contentOffset.y < 64; }}
            scrollEventThrottle={32}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", paddingHorizontal: 16, paddingVertical: 16 }}>
            {room.messages.map((message, index) => {
              const previous = room.messages[index - 1];
              const next = room.messages[index + 1];
              const showDay = message.date && (!previous || previous.date !== message.date);
              const grouped = previous && canGroupMessages(previous, message);
              return <View key={message.id} className="w-full" style={{ marginTop: index === 0 ? 0 : showDay ? 20 : grouped ? 4 : 12 }}>
                {showDay && <Text className="mb-3 text-center text-12 font-pretendard-regular text-grayscale-G900">{formatDay(message.date)}</Text>}
                {message.kind === "request" ? <RequestCard request={room.request} onPress={openRequest} />
                  : message.kind === "accepted" ? <View className="items-end"><AcceptedCard request={room.request} /></View>
                  : message.kind === "rejected" ? <View className="items-end"><RejectedCard reason={message.reason ?? room.rejectionReason} /></View>
                  : <Chat writer={message.writer} type={message.kind} text={message.text} time={message.time}
                    timeShow={!canGroupMessages(message, next)} imageSource={message.imageSource} imageAspectRatio={message.imageAspectRatio}
                    onPressPhoto={() => { Keyboard.dismiss(); setPhoto(message); }} />}
              </View>;
            })}
          </ScrollView>
          <View className="border-t border-grayscale-G100 bg-white px-4 pt-2.5" style={{ paddingBottom: Math.max(insets.bottom, 34) + 10 }}>
            {!!photoError && <Text accessibilityRole="alert" className="mb-2 text-12 font-pretendard-regular text-primary-500">{photoError}</Text>}
            <View className="flex-row items-end gap-1.5">
              <ButtonIcon icon={<PhotoIcon />} accessibilityLabel="사진 보내기" onPress={pickPhoto} disabled={picking} className="shrink-0" />
              <Field className="!w-auto min-w-0 flex-1 !py-0" accessibilityLabel="메시지 입력하기" placeholder="메시지 입력하기"
                value={draft} onChangeText={setDraft} returnKeyType="send" onSubmitEditing={send} />
              <ButtonIcon icon={<SendIcon />} variant="primary" accessibilityLabel="메시지 보내기" onPress={send} disabled={!draft.trim()} className="shrink-0 !opacity-100" />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
      {hasRequest && <RequestSheet visible={requestOpen} onClose={() => setRequestOpen(false)} request={room.request}
        status={room.requestStatus} rejectionReason={room.rejectionReason} initialStep={initialRequestStep} initialReason={initialRequestReason}
        onAccept={() => { followEnd.current = true; onAccept?.(); setRequestOpen(false); }}
        onReject={(reason) => { followEnd.current = true; onReject?.(reason); setRequestOpen(false); }} />}
      {!!photo && <PhotoViewer message={photo} onClose={() => setPhoto(null)} />}
    </View>
  );
}
