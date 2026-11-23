import Field from "@/components/field";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ProfileItemSheet, { ItemLabel } from "./ProfileItemSheet";
import { dateInputValue, isProfileDate, normalizeProfileDate } from "./profile-date";

export default function CertificateEditor({ visible = true, value, onSave, onBack }) {
  const [name, setName] = useState("");
  const [acquiredDate, setAcquiredDate] = useState("");
  const [issuer, setIssuer] = useState("");

  useEffect(() => {
    if (!visible) return;
    setName(value?.name ?? "");
    setAcquiredDate(value?.acquiredDate ?? "");
    setIssuer(value?.issuer ?? "");
  }, [visible, value]);

  const valid = Boolean(name.trim() && issuer.trim() && isProfileDate(acquiredDate));

  return (
    <ProfileItemSheet
      title="자격증 항목"
      visible={visible}
      onBack={onBack}
      disabled={!valid}
      onSave={() => {
        if (valid) onSave?.({ name: name.trim(), acquiredDate, issuer: issuer.trim() });
      }}
    >
      <View className="gap-2">
        <ItemLabel>이름</ItemLabel>
        <Field className="w-full" value={name} onChangeText={setName} placeholder="예: 생활스포츠지도사 2급" accessibilityLabel="자격증 이름" />
      </View>
      <View className="gap-2">
        <ItemLabel>취득 일시</ItemLabel>
        <Field
          className="w-full"
          value={dateInputValue(acquiredDate)}
          onChangeText={(text) => setAcquiredDate(normalizeProfileDate(text))}
          placeholder="YYYY.MM.DD"
          keyboardType="number-pad"
          inputMode="numeric"
          accessibilityLabel="취득 일시, 연도 월 일"
        />
      </View>
      <View className="gap-2">
        <ItemLabel>발급 기관</ItemLabel>
        <Field className="w-full" value={issuer} onChangeText={setIssuer} placeholder="예: 문화체육관광부" accessibilityLabel="발급 기관" />
      </View>
    </ProfileItemSheet>
  );
}
