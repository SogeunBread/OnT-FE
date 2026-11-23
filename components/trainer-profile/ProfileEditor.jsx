import Avatar from "@/assets/figma/profile-avatar-edit.svg";
import Camera from "@/assets/figma/profile-camera.svg";
import Delete from "@/assets/figma/delete.svg";
import Button from "@/components/button";
import Chip from "@/components/chip/Chip";
import FieldLong from "@/components/field-long";
import HeaderDetail from "@/components/header_detail";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LocationEditor from "./LocationEditor";
import SpecialtySheet from "./SpecialtySheet";
import PriceEditor from "./PriceEditor";
import CareerEditor from "./CareerEditor";
import CertificateEditor from "./CertificateEditor";
import { Benefit, DetailCard, formatMonth, formatPrice } from "./ProfileView";
import { formatCareerEndDate } from "./profile-date";

function FieldGroup({ label, required, count, children }) {
  return <View className="gap-2"><View className="flex-row items-center justify-between"><Text className="text-14 font-pretendard-semibold text-text">{label}{required ? <Text className="text-primary-main"> *</Text> : null}</Text>{count ? <Text className="text-12 font-pretendard-regular text-grayscale-G500">{count}</Text> : null}</View>{children}</View>;
}

function Remove({ label, onPress }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${label} 삭제`} hitSlop={8} onPress={onPress}><Delete /></Pressable>;
}

export function releaseProfilePhoto(source) {
  const uri = typeof source === "string" ? source : source?.uri;
  if (Platform.OS === "web" && uri?.startsWith("blob:")) URL.revokeObjectURL(uri);
}

// Draft changes stay here until onSave; parent supplies data, API and navigation callbacks.
export default function ProfileEditor({ value, onSave, onBack, places = [], addressOptions = [], onSearchAddress, initialSheet = null }) {
  const [draft, setDraft] = useState(() => ({ ...value }));
  const [sheet, setSheet] = useState(initialSheet);
  const [pickingPhoto, setPickingPhoto] = useState(false);
  const [error, setError] = useState("");
  const insets = useSafeAreaInsets();
  const draftRef = useRef(draft);
  const originalPhoto = useRef(value.avatarSource);
  const saved = useRef(false);
  const mounted = useRef(true);
  const picking = useRef(false);
  const nextId = useRef(0);
  draftRef.current = draft;
  const update = (key, next) => setDraft((current) => ({ ...current, [key]: next }));
  const closeSheet = () => { Keyboard.dismiss(); setSheet(null); };
  const back = () => { Keyboard.dismiss(); onBack?.(); };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (!saved.current && draftRef.current.avatarSource !== originalPhoto.current) releaseProfilePhoto(draftRef.current.avatarSource);
    };
  }, []);
  useEffect(() => {
    if (sheet) return;
    const listener = BackHandler.addEventListener("hardwareBackPress", () => { back(); return true; });
    return () => listener.remove();
  }, [sheet, onBack]);

  const pickPhoto = async () => {
    if (picking.current) return;
    picking.current = true;
    setPickingPhoto(true);
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 1, exif: false });
      if (result.canceled) return;
      const photo = result.assets[0];
      if (!mounted.current) { releaseProfilePhoto(photo); return; }
      if (!photo?.uri || photo.width <= 0 || photo.height <= 0) { releaseProfilePhoto(photo); setError("사진을 불러오지 못했어요. 다른 사진을 선택해주세요."); return; }
      if (draftRef.current.avatarSource !== originalPhoto.current) releaseProfilePhoto(draftRef.current.avatarSource);
      update("avatarSource", { uri: photo.uri });
    } catch {
      if (mounted.current) setError("사진을 불러오지 못했어요. 다시 시도해주세요.");
    } finally {
      picking.current = false;
      if (mounted.current) setPickingPhoto(false);
    }
  };

  const add = (key, entry) => {
    setDraft((current) => {
      let id;
      do { id = `profile-${key}-${nextId.current++}`; } while (current[key].some((item) => item.id === id));
      return { ...current, [key]: [...current[key], { ...entry, id }] };
    });
    closeSheet();
  };
  const remove = (key, id) => update(key, draft[key].filter((item) => item.id !== id));
  const open = (next) => { Keyboard.dismiss(); setSheet(next); };
  const save = () => {
    if (!draft.specialties.length) { setError("전문 분야를 1개 이상 선택해주세요."); return; }
    Keyboard.dismiss();
    saved.current = true;
    onSave?.({ ...draft, introduction: draft.introduction.trim() });
  };

  if (sheet === "location") return <LocationEditor value={draft.location} places={places} addressOptions={addressOptions} onSearchAddress={onSearchAddress} onBack={closeSheet} onSave={(location) => { update("location", location); closeSheet(); }} />;

  return (
    <View className="flex-1 bg-white">
      <HeaderDetail title="프로필 수정" subtitle="" actionType="none" onPressBack={back} />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="프로필 사진 변경" accessibilityState={{ busy: pickingPhoto, disabled: pickingPhoto }} disabled={pickingPhoto} onPress={pickPhoto} className="h-[100px] w-[100px] self-center">
            {draft.avatarSource ? <Image source={typeof draft.avatarSource === "string" ? { uri: draft.avatarSource } : draft.avatarSource} className="h-[100px] w-[100px] rounded-full" /> : <View className="h-[100px] w-[100px] overflow-hidden rounded-full"><Avatar /></View>}
            <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-white">{pickingPhoto ? <ActivityIndicator size="small" /> : <Camera />}</View>
          </Pressable>
          <Text className="self-center text-16 font-pretendard-semibold text-text">{draft.name} 트레이너</Text>
          <FieldGroup label="전문 분야" required>
            {draft.specialties.length ? <View className="flex-row flex-wrap gap-2">{draft.specialties.map((text) => <Chip key={text} text={text} accessibilityLabel="전문 분야 수정" onPress={() => open("specialty")} />)}</View> : <Button accessibilityRole="button" text="전문 분야 추가" variant="weakDark" onPress={() => open("specialty")} />}
          </FieldGroup>
          <FieldGroup label="소개글" count={`${draft.introduction.length}/500`}>
            <FieldLong className="w-full rounded-lg" accessibilityLabel="소개글" placeholder="소개글을 작성해주세요." maxLength={500} value={draft.introduction} onChangeText={(text) => update("introduction", text)} />
          </FieldGroup>
          <FieldGroup label="수업 위치">
            {draft.location ? <DetailCard title={draft.location.name} first={[draft.location.address, draft.location.detailAddress].filter(Boolean).join(" ")}><Remove label="수업 위치" onPress={() => update("location", null)} /></DetailCard> : <Button text="수업 위치 등록" accessibilityRole="button" variant="weakDark" onPress={() => open("location")} />}
          </FieldGroup>
          <FieldGroup label="가격">
            {draft.prices.map((item) => <View key={item.id} className="flex-row items-center justify-between gap-3 rounded-lg border border-grayscale-G100 p-3"><View className="min-w-0 flex-1 gap-1"><View className="flex-row flex-wrap items-center gap-2"><Text className="text-14 font-pretendard-regular text-text">{item.count}회</Text><Benefit>{item.benefit}</Benefit></View><Text className="text-14 font-pretendard-semibold text-text">{formatPrice(item.price)}원</Text></View><Remove label={`${item.count}회 가격`} onPress={() => remove("prices", item.id)} /></View>)}
            <Button text="가격 항목 추가" accessibilityRole="button" variant="weakDark" onPress={() => open("price")} />
          </FieldGroup>
          <FieldGroup label="경력">
            {draft.careers.map((item) => <DetailCard key={item.id} title={item.name} first={`${formatMonth(item.startDate)} - ${formatCareerEndDate(item.endDate)}`} second={item.position}><Remove label={item.name} onPress={() => remove("careers", item.id)} /></DetailCard>)}
            <Button text="경력 추가" accessibilityRole="button" variant="weakDark" onPress={() => open("career")} />
          </FieldGroup>
          <FieldGroup label="자격증">
            {draft.certificates.map((item) => <DetailCard key={item.id} title={item.name} first={`${formatMonth(item.acquiredDate)} 취득`} second={item.issuer}><Remove label={item.name} onPress={() => remove("certificates", item.id)} /></DetailCard>)}
            <Button text="자격증 추가" accessibilityRole="button" variant="weakDark" onPress={() => open("certificate")} />
          </FieldGroup>
          {error ? <Text accessibilityRole="alert" className="text-12 font-pretendard-regular text-primary-main">{error}</Text> : null}
        </ScrollView>
        <View className="border-t border-grayscale-G100 px-4 pt-2.5" style={{ paddingBottom: Math.max(insets.bottom, 34) + 10 }}>
          <Button accessibilityRole="button" text="수정하기" variant="fill" onPress={save} />
        </View>
      </KeyboardAvoidingView>
      {sheet === "specialty" ? <SpecialtySheet value={draft.specialties} onBack={closeSheet} onSave={(specialties) => { update("specialties", specialties); setError(""); closeSheet(); }} /> : null}
      {sheet === "price" ? <PriceEditor onBack={closeSheet} onSave={(entry) => add("prices", entry)} /> : null}
      {sheet === "career" ? <CareerEditor onBack={closeSheet} onSave={(entry) => add("careers", entry)} /> : null}
      {sheet === "certificate" ? <CertificateEditor onBack={closeSheet} onSave={(entry) => add("certificates", entry)} /> : null}
    </View>
  );
}
