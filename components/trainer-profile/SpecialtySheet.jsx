import Button from "@/components/button";
import Chip from "@/components/chip/Chip";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SPECIALTIES = ["다이어트", "체형교정", "근력강화", "재활운동", "체력향상", "바디프로필", "그룹PT", "임산부PT", "집중운동", "크로스핏", "맨몸운동", "식단관리", "자세교정", "통증관리"];

export default function SpecialtySheet({ value = [], onSave, onBack }) {
  const [selected, setSelected] = useState(value);
  const insets = useSafeAreaInsets();
  const toggle = (item) => setSelected((current) => current.includes(item)
    ? current.filter((entry) => entry !== item)
    : current.length < 5 ? [...current, item] : current);
  return (
    <Modal transparent animationType="slide" onRequestClose={onBack}>
      <View className="flex-1 justify-end bg-text/20">
        <Pressable accessibilityRole="button" accessibilityLabel="전문 분야 선택 닫기" className="absolute inset-0" onPress={onBack} />
        <View accessibilityViewIsModal className="max-h-[90%] rounded-t-[20px] bg-white pt-3">
          <View className="h-1 w-[60px] self-center rounded-full bg-grayscale-G100" />
          <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 20, gap: 20 }} keyboardShouldPersistTaps="handled">
            <Text className="text-16 font-pretendard-semibold text-text">전문 분야</Text>
            <View className="flex-row flex-wrap gap-2">
              {SPECIALTIES.map((item) => (
                <Chip key={item} text={item} selected={selected.includes(item)}
                  accessibilityLabel={item} accessibilityState={{ selected: selected.includes(item) }}
                  onPress={() => toggle(item)} />
              ))}
            </View>
          </ScrollView>
          <View className="px-4 pt-2.5" style={{ paddingBottom: Math.max(insets.bottom, 34) + 10 }}>
            <Button accessibilityRole="button" text={`저장 (${selected.length}/5)`} variant="fill" onPress={() => onSave(selected)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
