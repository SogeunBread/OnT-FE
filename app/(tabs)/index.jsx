import Button from "@/components/button/Button";
import ButtonTwo from "@/components/button/ButtonTwo";
import Check from "@/components/check/Check";
import Checkbox from "@/components/checkbox/Checkbox";
import ChipSquare from "@/components/chip/ChipSquare";
import Heart from "@/components/heart/Heart";
import Radio from "@/components/radio/Radio";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TypographyTest() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [cardChecked, setCardChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState("male");

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* ==== ChipSuqare Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        ChipSquare Test
      </Text>

      <View className="mb-6 gap-3">
        <ChipSquare
          value="male"
          content="남자"
          selected={selectedValue === "male"}
          onChange={setSelectedValue}
        />

        <ChipSquare
          value="female"
          content="여자"
          selected={selectedValue === "female"}
          onChange={setSelectedValue}
        />
      </View>
      {/* ==== Checkbox Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        Checkbox Test
      </Text>

      <View className="mb-6 gap-3">
        <Checkbox
          title="메인 텍스트"
          subtitle="서브 텍스트"
          checked={cardChecked}
          onChange={setCardChecked}
        />

        {/* 보여주기용 */}
        <Checkbox
          title="선택된 상태"
          subtitle="선택된 상태의 서브 텍스트"
          checked={true}
        />
      </View>
      {/* ==== Heart Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        Heart Test
      </Text>

      <View className="mb-6 gap-3">
        <Heart liked={isLiked} onChange={setIsLiked} size={28} />

        {/* 보여주기용 */}
        <Heart liked={true} size={28} />
      </View>

      {/* ===== Button Test ===== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        Button Test
      </Text>

      {/* 기본 상태 + 약한 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Default State + Weak Style
        </Text>
        <Button text="버튼" state="default" style="weak" />
      </View>

      {/* 기본 상태 + 채운 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Default State + Fill Style
        </Text>
        <Button text="버튼" state="default" style="fill" />
      </View>

      {/* 클릭 상태 + 약한 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Click State + Weak Style
        </Text>
        <Button text="버튼" state="click" style="weak" />
      </View>

      {/* 클릭 상태 + 채운 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Click State + Fill Style
        </Text>
        <Button text="버튼" state="click" style="fill" />
      </View>

      {/* 비활성화 상태 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">Disabled State</Text>
        <Button text="버튼" state="disabled" />
      </View>

      {/* ===== ButtonTwo Test ===== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        ButtonTwo Test
      </Text>

      <View className="mb-6 space-y-2">
        <ButtonTwo />
      </View>

      {/* ==== Check Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        Check Test
      </Text>

      <View className="mb-6 space-y-2">
        <Check
          checked={isChecked}
          onChange={setIsChecked}
          label={isChecked ? "선택됨" : "미선택"}
        />
        {/* ==== 보여주기용 ====*/}
        <Check checked={true} label="선택됨" />
      </View>

      {/* === Radio Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        Radio Test
      </Text>

      <View className="mb-6 space-y-2">
        <Radio
          checked={selectedRadio === 0}
          onPress={() => setSelectedRadio(0)}
          label="Option 1"
        />
        <Radio
          checked={selectedRadio === 1}
          onPress={() => setSelectedRadio(1)}
          label="Option 2"
        />
        <Radio
          checked={selectedRadio === 2}
          onPress={() => setSelectedRadio(2)}
          label="Option 3"
        />
      </View>

      {/* ===== Font Size & Weight Test ===== */}
      <Text className="mb-4 mt-10 text-18 font-pretendard-bold text-primary-main">
        Typography Test
      </Text>

      <View className="space-y-3">
        <Text className="text-12 font-pretendard-regular text-text">
          12 / Regular – 프리텐다드
        </Text>

        <Text className="text-12 font-pretendard-semibold text-text">
          12 / Semibold – 프리텐다드
        </Text>

        <Text className="text-14 font-pretendard-regular text-text">
          14 / Regular – 프리텐다드
        </Text>

        <Text className="text-14 font-pretendard-semibold text-text">
          14 / Semibold – 프리텐다드
        </Text>

        <Text className="text-16 font-pretendard-regular text-text">
          16 / Regular – 프리텐다드
        </Text>

        <Text className="text-16 font-pretendard-medium text-text">
          16 / Medium – 프리텐다드
        </Text>

        <Text className="text-16 font-pretendard-semibold text-text">
          16 / Semibold – 프리텐다드
        </Text>

        <Text className="text-18 font-pretendard-medium text-text">
          18 / Medium – 프리텐다드
        </Text>

        <Text className="text-18 font-pretendard-bold text-text">
          18 / Bold – 프리텐다드
        </Text>

        <Text className="text-24 font-pretendard-medium text-text">
          24 / Medium – 프리텐다드
        </Text>

        <Text className="text-24 font-pretendard-bold text-text">
          24 / Bold – 프리텐다드
        </Text>
      </View>

      {/* ===== Color Test ===== */}
      <View className="mt-10 space-y-4">
        <Text className="text-18 font-pretendard-bold">Color Test</Text>

        {/* Primary */}
        <View className="flex-row flex-wrap gap-3">
          <ColorBox color="bg-primary-50" label="primary-50" />
          <ColorBox color="bg-primary-100" label="primary-100" />
          <ColorBox color="bg-primary-200" label="primary-200" />
          <ColorBox color="bg-primary-300" label="primary-300" />
          <ColorBox color="bg-primary-main" label="primary-main" />
          <ColorBox color="bg-primary-500" label="primary-500" />
        </View>

        {/* Secondary */}
        <View className="flex-row gap-3">
          <ColorBox color="bg-secondary-blue" label="secondary-blue" />
          <ColorBox color="bg-secondary-yellow" label="secondary-yellow" />
        </View>

        {/* Text colors */}
        <View className="space-y-2">
          <Text className="text-text">text / DEFAULT</Text>
          <Text className="text-text-sub">text / sub</Text>
          <Text className="text-text-sub2">text / sub2</Text>
          <Text className="text-text-disabled">text / disabled</Text>
          <View className="bg-black p-2">
            <Text className="text-text-inverse">text / inverse</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function ColorBox({ color, label }) {
  return (
    <View className="items-center">
      <View className={`h-16 w-16 rounded-lg ${color}`} />
      <Text className="mt-1 text-12 text-text-sub">{label}</Text>
    </View>
  );
}
