import Field from "@/components/field";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ProfileItemSheet, { ItemLabel } from "./ProfileItemSheet";
import { dateInputValue, isCareerPeriodValid, isProfileDate, normalizeProfileDate, profileToday } from "./profile-date";

export default function CareerEditor({ visible = true, value, onSave, onBack }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (!visible) return;
    setName(value?.name ?? "");
    setStartDate(value?.startDate ?? "");
    setEndDate(value?.endDate ?? "");
    setPosition(value?.position ?? "");
  }, [visible, value]);

  const validDates = isProfileDate(startDate) && (!endDate || isProfileDate(endDate));
  const today = profileToday();
  const dateOrderError = validDates && Boolean(endDate) && startDate > endDate;
  const startDateError = isProfileDate(startDate) && startDate >= today;
  const endDateError = isProfileDate(endDate) && endDate > today;
  const valid = Boolean(name.trim() && position.trim() && isCareerPeriodValid(startDate, endDate, today));

  return (
    <ProfileItemSheet
      title="경력 항목"
      visible={visible}
      onBack={onBack}
      disabled={!valid}
      onSave={() => {
        if (name.trim() && position.trim() && isCareerPeriodValid(startDate, endDate)) {
          onSave?.({ name: name.trim(), startDate, endDate, position: position.trim() });
        }
      }}
    >
      <View className="gap-2">
        <ItemLabel>이름</ItemLabel>
        <Field className="w-full" value={name} onChangeText={setName} placeholder="예: 온트트레이닝" accessibilityLabel="경력 이름" />
      </View>
      <View className="gap-2">
        <ItemLabel>근무 기간</ItemLabel>
        <View className="flex-row items-center gap-2">
          <Field
            className="min-w-0 flex-1"
            value={dateInputValue(startDate)}
            onChangeText={(text) => setStartDate(normalizeProfileDate(text))}
            placeholder="YYYY.MM.DD"
            keyboardType="number-pad"
            inputMode="numeric"
            accessibilityLabel="근무 시작일, 연도 월 일"
          />
          <Text className="w-3 text-center text-14 font-pretendard-regular text-grayscale-G700">~</Text>
          <Field
            className="min-w-0 flex-1"
            value={dateInputValue(endDate)}
            onChangeText={(text) => setEndDate(normalizeProfileDate(text))}
            placeholder="YYYY.MM.DD"
            keyboardType="number-pad"
            inputMode="numeric"
            accessibilityLabel="근무 종료일, 연도 월 일, 비워두면 현재"
          />
        </View>
        {dateOrderError && <Text accessibilityRole="alert" className="text-12 font-pretendard-regular text-primary-main">종료일은 시작일 이후로 입력해주세요.</Text>}
        {startDateError && <Text accessibilityRole="alert" className="text-12 font-pretendard-regular text-primary-main">시작일은 오늘 이전 날짜로 입력해주세요.</Text>}
        {endDateError && <Text accessibilityRole="alert" className="text-12 font-pretendard-regular text-primary-main">종료일은 오늘 또는 이전 날짜로 입력해주세요.</Text>}
      </View>
      <View className="gap-2">
        <ItemLabel>직책</ItemLabel>
        <Field className="w-full" value={position} onChangeText={setPosition} placeholder="예: 트레이너" accessibilityLabel="직책" />
      </View>
    </ProfileItemSheet>
  );
}
