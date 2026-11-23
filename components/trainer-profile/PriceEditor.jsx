import Field from "@/components/field";
import ChipSquare from "@/components/chip/ChipSquare";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ProfileItemSheet, { ItemLabel } from "./ProfileItemSheet";

const COUNTS = [1, 10, 15, 20, 25, 30];

export default function PriceEditor({ visible = true, value, onSave, onBack }) {
  const [count, setCount] = useState(null);
  const [benefit, setBenefit] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!visible) return;
    setCount(value?.count ?? null);
    setBenefit(value?.benefit ?? "");
    setPrice(String(value?.price ?? "").replace(/\D/g, ""));
  }, [visible, value]);

  const valid = COUNTS.includes(count) && Number(price) > 0;

  return (
    <ProfileItemSheet
      visible={visible}
      title="가격 항목"
      onBack={onBack}
      disabled={!valid}
      onSave={() => {
        if (valid) onSave?.({ count, benefit: benefit.trim(), price });
      }}
    >
      <View className="gap-2">
        <ItemLabel>횟수</ItemLabel>
        <View className="flex-row gap-1.5">
          {COUNTS.map((number) => (
            <ChipSquare
              key={number}
              content={`${number}회`}
              value={number}
              selected={count === number}
              onChange={setCount}
              accessibilityRole="radio"
              accessibilityLabel={`${number}회`}
              accessibilityState={{ checked: count === number }}
              className="min-w-0 flex-1 rounded-lg !px-0 !py-[11px]"
            />
          ))}
        </View>
      </View>
      <View className="gap-2">
        <ItemLabel required={false}>부가 상품</ItemLabel>
        <Field
          className="w-full"
          value={benefit}
          onChangeText={setBenefit}
          placeholder="예: 헬스장 3개월 이용권"
          accessibilityLabel="부가 상품"
        />
      </View>
      <View className="gap-2">
        <ItemLabel>가격</ItemLabel>
        <View className="flex-row items-center gap-2">
          <Field
            className="min-w-0 flex-1"
            value={price ? Number(price).toLocaleString("ko-KR") : ""}
            onChangeText={(text) => setPrice(text.replace(/\D/g, "").slice(0, 12))}
            placeholder="예: 450,000"
            keyboardType="number-pad"
            inputMode="numeric"
            accessibilityLabel="가격"
          />
          <Text className="text-16 font-pretendard-semibold text-grayscale-G800">원</Text>
        </View>
      </View>
    </ProfileItemSheet>
  );
}
