import PhotoIcon from "@/assets/figma/chat-photo.svg";
import SendIcon from "@/assets/figma/chat-send.svg";
import { useEffect, useRef, useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import HeaderDetail from "@/components/header_detail";
import ButtonIcon from "@/components/button_icon";
import Field from "@/components/field";
import Chat from "@/components/chat";
import ChatMeal from "@/components/chat_meal";
import ChatPT from "@/components/chat_pt";
import { RequestCard, AcceptedCard, RejectedCard } from "@/components/pt-request/RequestCards";
import MealPhotoViewer from "@/components/meal-record/MealPhotoViewer";
import { canGroupMessages } from "@/features/trainer-chat/state";
import { userChatImages } from "@/constants/userTrainer";
import { canChat, latestRequest, requestEditable } from "./state";
import UserRequestSheet from "./UserRequestSheet";
import PhotoSendPreview from "./PhotoSendPreview";
import RecordDetails from "./RecordDetails";

const dayLabel = (value) => { const [year, month, day] = value.split("-").map(Number); return `${year}년 ${month}월 ${day}일`; };
const isMeal = (message) => ["meal", "feedback"].includes(message?.kind);
const isCard = (message) => message && !["text", "photo"].includes(message.kind);
const uriFor = (source) => typeof source === "number" ? Image.resolveAssetSource(source)?.uri : typeof source === "string" ? source : source?.uri;

export default function UserChatRoom({ room, draft = "", onDraft, onSendText, onSendPhoto, onBack, onEditRequest, onNewRequest, onCancelRequest,
  initialRequest = false, initialConfirm = false, initialPhoto = false, initialFocus = false, onOpenRecord }) {
  const insets = useSafeAreaInsets();
  const [requestId, setRequestId] = useState(initialRequest ? latestRequest(room)?.id : null);
  const [photo, setPhoto] = useState(initialPhoto ? { source: userChatImages.pizza, width: 390, height: 259 } : null);
  const [viewing, setViewing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [picking, setPicking] = useState(false);
  const pending = useRef(null);
  const active = useRef(true);
  const pickingRef = useRef(false);
  const input = useRef(null);
  const scroll = useRef(null);
  const followEnd = useRef(true);
  const newest = latestRequest(room);
  const request = room?.requests.find((item) => item.id === requestId);
  const headerRequest = newest && ["pending", "accepted"].includes(newest.status);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      if (pending.current?.uri?.startsWith("blob:")) URL.revokeObjectURL(pending.current.uri);
    };
  }, []);
  const closePhoto = () => {
    if (pending.current?.uri?.startsWith("blob:")) URL.revokeObjectURL(pending.current.uri);
    pending.current = null;
    setPhoto(null);
  };
  const openRequest = (id = newest?.id) => { Keyboard.dismiss(); setRequestId(id); };
  const openRecord = (value) => { Keyboard.dismiss(); if (onOpenRecord) onOpenRecord(value); else setDetail(value); };
  const toEnd = () => { if (followEnd.current) scroll.current?.scrollToEnd({ animated: false }); };
  const send = () => {
    if (!canChat(room) || !draft.trim()) return;
    followEnd.current = true;
    onSendText?.();
    requestAnimationFrame(() => input.current?.focus());
  };
  const pick = async () => {
    if (!canChat(room) || pickingRef.current) return;
    pickingRef.current = true; setPicking(true); setPhotoError(""); Keyboard.dismiss();
    try {
      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!active.current) return;
        if (!permission.granted) { setPhotoError("사진을 보내려면 사진 접근 권한을 허용해주세요."); return; }
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsMultipleSelection: false, allowsEditing: false, quality: 1, exif: false });
      const selected = result.assets?.[0];
      if (!active.current) { if (selected?.uri?.startsWith("blob:")) URL.revokeObjectURL(selected.uri); return; }
      if (result.canceled) return;
      if (!selected?.uri || !(selected.width > 0 && selected.height > 0)) { if (selected?.uri?.startsWith("blob:")) URL.revokeObjectURL(selected.uri); setPhotoError("사진을 불러오지 못했어요. 다시 선택해주세요."); return; }
      pending.current = selected; setPhoto(selected);
    } catch { if (active.current) setPhotoError("사진을 불러오지 못했어요. 다시 선택해주세요."); }
    finally { pickingRef.current = false; if (active.current) setPicking(false); }
  };
  return <View className="flex-1 bg-white">
    <HeaderDetail title={room?.trainer.name ?? "채팅"} subtitle="" actionType={room ? "button" : "none"}
      buttonLabel={headerRequest ? "요청서 확인" : "수업 요청"} onPressBack={onBack}
      onPressAction={headerRequest ? () => openRequest() : onNewRequest} />
    {!room ? <View className="flex-1 items-center justify-center"><Text className="text-14 text-grayscale-G500">채팅방을 찾을 수 없어요.</Text></View> :
      <KeyboardAvoidingView className="min-h-0 flex-1" behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}>
        <ScrollView ref={scroll} className="flex-1" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
          onLayout={toEnd} onContentSizeChange={toEnd} scrollEventThrottle={32}
          onScroll={({ nativeEvent: e }) => { followEnd.current = e.contentSize.height - e.layoutMeasurement.height - e.contentOffset.y < 64; }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}>
          {room.messages.map((message, index) => {
            const previous = room.messages[index - 1];
            const next = room.messages[index + 1];
            const showDay = message.date && (!previous || previous.date !== message.date);
            const grouped = canGroupMessages(previous ?? {}, message) || (message.kind === "feedback" && previous?.kind === "feedback");
            const cardRequest = room.requests.find((item) => item.id === message.requestId);
            const card = message.kind === "request" ? <RequestCard request={cardRequest} onPress={() => openRequest(message.requestId)} /> :
              message.kind === "accepted" ? <AcceptedCard request={cardRequest} /> :
              message.kind === "rejected" ? <RejectedCard reason={message.reason ?? "현재 신규 회원을 받고 있지 않습니다"} /> :
              ["cancelled", "expired"].includes(message.kind) ? <RejectedCard title="PT 수업 요청이 취소되었어요." reasonLabel={null}
                reason={message.kind === "expired" ? "요청 후 72시간이 지나 수업 요청이 취소되었습니다." : "회원이 직접 수업 요청을 취소했습니다."} /> :
              isMeal(message) ? <ChatMeal from={message.kind === "meal" ? "user" : "trainer"} date={message.mealDate} photoCount={message.photoCount}
                onPress={() => openRecord({ kind: "meal", id: message.mealId })} /> :
              message.kind.startsWith("pt-") ? <ChatPT variant={message.kind.slice(3)} lesson={message.lesson} time={message.lessonTime} previousTime={message.previousTime}
                onPress={() => openRecord({ kind: "pt", id: message.sessionId })} /> : null;
            return <View key={message.id} className="w-full" style={{ marginTop: index === 0 ? 0 : showDay ? 20 : grouped ? 4 : 12 }}>
              {showDay && <Text className="mb-3 text-center text-12 font-pretendard-regular text-grayscale-G900">{dayLabel(message.date)}</Text>}
              {isCard(message) ? <View className={message.kind === "meal" ? "items-end" : message.kind === "request" || ["cancelled", "expired"].includes(message.kind) ? "items-center" : "items-start"}>{card}</View> :
                <Chat writer={message.writer} type={message.kind} text={message.text} time={message.time} timeShow={!canGroupMessages(message, next)}
                  imageSource={message.imageSource} imageAspectRatio={message.imageAspectRatio} onPressPhoto={() => { Keyboard.dismiss(); setViewing(message); }} />}
            </View>;
          })}
        </ScrollView>
        <View className="border-t border-grayscale-G100 bg-white px-4 py-2.5" style={{ paddingBottom: Math.max(insets.bottom, 10) }}>
          {!!photoError && <Text accessibilityRole="alert" className="mb-2 text-12 text-primary-500">{photoError}</Text>}
          <View className="flex-row items-center gap-1.5">
            <ButtonIcon icon={<PhotoIcon />} accessibilityLabel="사진 선택" onPress={pick} disabled={picking || !canChat(room)} />
            <Field inputRef={input} value={draft} onChangeText={onDraft} onSubmitEditing={send} autoFocus={initialFocus} blurOnSubmit={false} returnKeyType="send"
              disabled={!canChat(room)} placeholder="메시지 입력하기" accessibilityLabel="메시지 입력하기" className="!w-auto min-w-0 flex-1 !py-0" />
            <ButtonIcon icon={<SendIcon />} variant="primary" accessibilityLabel="메시지 보내기" onPress={send} disabled={!canChat(room) || !draft.trim()} className="!opacity-100" />
          </View>
        </View>
      </KeyboardAvoidingView>}
    {!!request && <UserRequestSheet key={request.id} request={request} editable={requestEditable(room, request)} initialConfirm={initialConfirm}
      onClose={() => setRequestId(null)} onEdit={() => { setRequestId(null); onEditRequest(request); }}
      onCancel={() => { onCancelRequest(request.id); setRequestId(null); }} />}
    {!!photo && <PhotoSendPreview key={photo.uri ?? "preview"} photo={photo} onClose={closePhoto} onSend={(selected) => {
      followEnd.current = true;
      const accepted = onSendPhoto?.(selected);
      if (accepted !== false) { pending.current = null; setPhoto(null); }
      else closePhoto();
    }} />}
    {!!viewing && <MealPhotoViewer photos={[{ uri: uriFor(viewing.imageSource) }]} onClose={() => setViewing(null)} />}
    <RecordDetails detail={detail} onClose={() => setDetail(null)} />
  </View>;
}
