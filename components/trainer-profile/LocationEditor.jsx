import RightIcon from "@/assets/figma/profile-location-right.svg";
import SearchIcon from "@/assets/figma/search.svg";
import Button from "@/components/button";
import Field from "@/components/field/Field";
import FieldSearch from "@/components/field/FieldSearch";
import HeaderDetail from "@/components/header_detail";
import Radio from "@/components/radio/Radio";
import { useEffect, useState } from "react";
import {
  BackHandler,
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

const Label = ({ children, required = false }) => (
  <Text className="text-14 font-pretendard-semibold text-text">
    {children}{required && <Text className="text-primary-main"> *</Text>}
  </Text>
);

function HighlightedName({ name, query }) {
  const index = name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
  if (index < 0 || !query) return name;
  return (
    <>
      {name.slice(0, index)}
      <Text className="text-primary-main">{name.slice(index, index + query.length)}</Text>
      {name.slice(index + query.length)}
    </>
  );
}

// Data and search callbacks belong to the caller; no network requests are made here.
export default function LocationEditor({
  value,
  onSave,
  onBack,
  places = [],
  addressOptions = [],
  onSearchAddress,
  initialMode,
  initialQuery = "",
  initialSelectionId,
}) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState(initialMode ?? (value?.name ? "manual" : "search"));
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState(() => places.find((place) => place.id === initialSelectionId) ?? null);
  const [name, setName] = useState(value?.name ?? "");
  const [address, setAddress] = useState(value?.address ?? "");
  const [detailAddress, setDetailAddress] = useState(value?.detailAddress ?? "");
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [error, setError] = useState("");
  const normalizedQuery = query.trim();
  const results = normalizedQuery
    ? places.filter((place) => place.name.toLocaleLowerCase().includes(normalizedQuery.toLocaleLowerCase()))
    : [];
  const addresses = addressOptions.filter((option) => option.address.includes(addressQuery.trim()));
  const valid = mode === "manual" ? Boolean(name.trim() && address.trim()) : Boolean(selected);

  const handleBack = () => {
    Keyboard.dismiss();
    if (addressPickerOpen) setAddressPickerOpen(false);
    else if (mode === "manual" && !value?.name && initialMode !== "manual") setMode("search");
    else onBack?.();
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();
      return true;
    });
    return () => subscription.remove();
  });

  const chooseAddress = (nextAddress) => {
    setAddress(nextAddress.trim());
    setAddressPickerOpen(false);
    setAddressQuery("");
  };

  const searchAddress = async () => {
    if (searchingAddress) return;
    Keyboard.dismiss();
    setError("");
    if (!onSearchAddress) {
      setAddressPickerOpen(true);
      return;
    }
    setSearchingAddress(true);
    try {
      const result = await onSearchAddress();
      if (result) chooseAddress(typeof result === "string" ? result : result.address);
    } catch {
      setError("주소를 불러오지 못했어요. 다시 시도해 주세요.");
    } finally {
      setSearchingAddress(false);
    }
  };

  const save = () => {
    if (!valid) return;
    Keyboard.dismiss();
    onSave?.(mode === "manual"
      ? { name: name.trim(), address: address.trim(), detailAddress: detailAddress.trim() }
      : { ...selected, detailAddress: selected.detailAddress ?? "" });
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderDetail title="수업 위치 등록" subtitle="" actionType="none" showBorder={false} onPressBack={handleBack} />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: 24 }}>
          {mode === "search" ? (
            <>
              <View className="px-4">
                <FieldSearch
                  value={query}
                  onChangeText={(text) => { setQuery(text); setSelected(null); }}
                  accessibilityLabel="헬스장 이름"
                  placeholder="헬스장 이름을 입력해주세요."
                  className="w-full !py-0"
                  autoCorrect={false}
                  returnKeyType="search"
                  onSubmitEditing={Keyboard.dismiss}
                />
                {normalizedQuery ? (
                  <Pressable accessibilityRole="button" onPress={() => { Keyboard.dismiss(); setMode("manual"); }} className="mt-3 flex-row items-center gap-3 rounded-lg bg-grayscale-G50 px-4 py-3">
                    <View className="min-w-0 flex-1 gap-0.5">
                      <Text className="text-14 font-pretendard-medium text-text">찾는 장소가 없나요?</Text>
                      <Text className="text-12 font-pretendard-medium text-grayscale-G600">도로명 주소로 입력해서 직접 등록할 수 있어요.</Text>
                    </View>
                    <RightIcon />
                  </Pressable>
                ) : null}
              </View>
              {normalizedQuery ? (
                <View className="mt-3" accessibilityRole="radiogroup">
                  {results.map((place) => {
                    const checked = selected?.id === place.id;
                    return (
                      <Pressable key={place.id} accessibilityRole="radio" accessibilityState={{ checked }} accessibilityLabel={`${place.name}, ${place.address}`} onPress={() => { Keyboard.dismiss(); setSelected(place); }} className={`min-h-[66px] flex-row items-center gap-3 border-b border-grayscale-G100 px-[18px] py-3 ${checked ? "bg-primary-50/50" : "bg-white"}`}>
                        <View className="min-w-0 flex-1 gap-0.5">
                          <Text className="text-14 font-pretendard-medium text-text">{selected ? place.name : <HighlightedName name={place.name} query={normalizedQuery} />}</Text>
                          <Text className="text-12 font-pretendard-medium text-grayscale-G600">{place.address}</Text>
                        </View>
                        <View pointerEvents="none" accessible={false}><Radio checked={checked} /></View>
                      </Pressable>
                    );
                  })}
                  {!results.length && <Text accessibilityLiveRegion="polite" className="px-4 py-8 text-center text-14 font-pretendard-regular text-grayscale-G500">검색 결과가 없어요.</Text>}
                </View>
              ) : null}
            </>
          ) : (
            <View className="gap-4 px-4">
              <View className="gap-2">
                <Label required>수업 장소 이름</Label>
                <Field value={name} onChangeText={setName} accessibilityLabel="수업 장소 이름, 필수" placeholder="수업 장소 이름을 입력해주세요." className="w-full" />
              </View>
              <View className="gap-2">
                <Label required>수업 장소 주소</Label>
                <Pressable accessibilityRole="button" accessibilityLabel="도로명 주소 검색" accessibilityState={{ disabled: searchingAddress, busy: searchingAddress }} disabled={searchingAddress} onPress={searchAddress} className="min-h-11 flex-row items-center gap-3 rounded-lg border border-grayscale-G300 bg-white px-3 py-2.5">
                  <Text className={`min-w-0 flex-1 text-14 font-pretendard-regular ${address ? "text-text" : "text-grayscale-G500"}`}>{address || "도로명 주소 검색"}</Text>
                  {!address && <SearchIcon />}
                </Pressable>
              </View>
              <View className="gap-2">
                <Label>상세 주소</Label>
                <Field value={detailAddress} onChangeText={setDetailAddress} accessibilityLabel="상세 주소, 선택" placeholder="건물명, 동, 호수 등을 입력해주세요." className="w-full" />
              </View>
              {error ? <Text accessibilityRole="alert" className="text-12 font-pretendard-regular text-primary-main">{error}</Text> : null}
            </View>
          )}
        </ScrollView>
        <View className="border-t border-grayscale-G100 bg-white px-4 pt-2.5" style={{ paddingBottom: Math.max(insets.bottom, 34) + 10 }}>
          <Button text="등록하기" variant="fill" disabled={!valid} accessibilityRole="button" accessibilityState={{ disabled: !valid }} onPress={save} />
        </View>
      </KeyboardAvoidingView>
      <Modal transparent animationType="fade" visible={addressPickerOpen} onRequestClose={() => setAddressPickerOpen(false)}>
        <KeyboardAvoidingView className="flex-1 justify-center bg-black/40 px-4" behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable accessibilityRole="button" accessibilityLabel="주소 선택 닫기" className="absolute inset-0" onPress={() => setAddressPickerOpen(false)} />
          <View accessibilityViewIsModal className="max-h-[80%] w-full max-w-[500px] self-center gap-4 rounded-xl bg-white p-4">
            <Text className="text-18 font-pretendard-bold text-text">수업 장소 주소</Text>
            <Text className="text-12 font-pretendard-regular text-grayscale-G600">개발용 예시 주소입니다. 도로명 주소를 직접 입력할 수도 있어요.</Text>
            <FieldSearch value={addressQuery} onChangeText={setAddressQuery} accessibilityLabel="도로명 주소 입력" placeholder="도로명 주소 검색" className="w-full" autoFocus />
            <ScrollView keyboardShouldPersistTaps="handled">
              {addresses.map((option) => (
                <Pressable key={option.id ?? option.address} accessibilityRole="button" onPress={() => chooseAddress(option.address)} className="border-b border-grayscale-G100 py-3">
                  <Text className="text-14 font-pretendard-regular text-text">{option.address}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View className="flex-row gap-2">
              <Button text="취소" className="flex-1" onPress={() => setAddressPickerOpen(false)} />
              <Button text="선택" className="flex-1" variant="fill" disabled={!addressQuery.trim()} onPress={() => chooseAddress(addressQuery)} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
