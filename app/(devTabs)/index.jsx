import AreaChildBg from "@/components/area_child/AreaChildBg";
import AreaChildCheck from "@/components/area_child/AreaChildCheck";
import AreaParent from "@/components/area_parent/AreaParent";
import Button from "@/components/button/Button";
import ButtonSmall from "@/components/button/ButtonSmall";
import ButtonTwo from "@/components/button/ButtonTwo";
import Check from "@/components/check/Check";
import CheckSquare from "@/components/check/CheckSquare";
import Checkbox from "@/components/checkbox/Checkbox";
import CheckboxBig from "@/components/checkbox/CheckboxBig";
import ChipSquare from "@/components/chip/ChipSquare";
import Heart from "@/components/heart/Heart";
import Radio from "@/components/radio/Radio";
import RadioBig from "@/components/radio/RadioBig";
import Tag from "@/components/tag/Tag";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TypographyTest() {
  const [isChecked, setIsChecked] = useState(false);
  const [squareChecked, setSquareChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [cardChecked, setCardChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState("male");
  const [bigChecked, setBigChecked] = useState(false);
  const [areaSelected, setAreaSelected] = useState(false);
  const [bgSelected, setBgSelected] = useState(false);
  const [checkSelected, setCheckSelected] = useState(false);
  const [bigRadio, setBigRadio] = useState(false);

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* ==== ButtonSmall Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        ButtonSmall Test
      </Text>
      <View className="mb-6 gap-3">
        <ButtonSmall text="버튼" />
        <ButtonSmall text="버튼" disabled />
      </View>

      {/* ==== Tag Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        Tag Test
      </Text>
      <View className="flex-row mb-6 gap-3">
        <Tag text="#근력증가" />
        <Tag text="#재활" />
      </View>

      {/* ==== RadioBig Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        RadioBig Test
      </Text>

      <View className="mb-6 gap-3">
        {/* 토글 테스트 */}
        <RadioBig
          title="메인 텍스트"
          subtitle="서브 텍스트"
          checked={bigRadio}
          onChange={setBigRadio}
        />

        {/* 항상 선택 */}
        <RadioBig title="선택된 상태" subtitle="선택" checked={true} />

        {/* 항상 미선택 */}
        <RadioBig title="미선택 상태" subtitle="미선택" checked={false} />

        {/* disabled 테스트 */}
        <RadioBig
          title="비활성화"
          subtitle="비활성화 상태도 일단 구현은 해둠"
          checked={false}
          disabled
        />
      </View>

      {/* ==== AreaChildBg Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        AreaChildBg Test
      </Text>

      <View className="mb-6 gap-3">
        {/* 토글 테스트 */}
        <AreaChildBg
          title="토글 테스트"
          selected={bgSelected}
          onChange={setBgSelected}
        />

        {/* 항상 선택 상태 */}
        <AreaChildBg title="항상 선택" selected={true} />

        {/* 항상 미선택 상태 */}
        <AreaChildBg title="항상 미선택" selected={false} />
      </View>

      {/* ==== AreaChildCheck Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        AreaChildCheck Test
      </Text>

      <View className="mb-6 gap-3">
        {/* 토글 테스트 */}
        <AreaChildCheck
          title="토글 테스트"
          checked={checkSelected}
          onChange={setCheckSelected}
        />

        {/* 항상 체크 상태 */}
        <AreaChildCheck title="항상 체크" checked={true} />

        {/* 항상 미체크 상태 */}
        <AreaChildCheck title="항상 미체크" checked={false} />
      </View>

      {/* ==== AreaParent Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        AreaParent Test
      </Text>

      <View className="mb-6 gap-3">
        {/* 토글 테스트 */}
        <AreaParent
          title="title"
          selected={areaSelected}
          onChange={setAreaSelected}
        />

        {/* 항상 선택 상태 */}
        <AreaParent title="선택" selected={true} />

        {/* 항상 미선택 상태 */}
        <AreaParent title="미선택" selected={false} />
      </View>

      {/* ==== CheckboxBig Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        CheckboxBig Test
      </Text>

      <View className="mb-6 gap-3">
        {/* 토글 테스트 */}
        <CheckboxBig
          title="메인 텍스트"
          subtitle="서브 텍스트"
          checked={bigChecked}
          onChange={setBigChecked}
        />

        {/* 항상 선택 상태 */}
        <CheckboxBig
          title="선택된 상태"
          subtitle="checked=true"
          checked={true}
        />

        {/* 항상 미선택 상태 */}
        <CheckboxBig
          title="미선택 상태"
          subtitle="checked=false"
          checked={false}
        />
      </View>
      {/* ==== ChipSquare Test ==== */}
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
        <Button text="버튼" state="default" variant="weak" />
      </View>

      {/* 클릭 상태 + 약한 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Click State + Weak Style
        </Text>
        <Button text="버튼" state="click" variant="weak" />
      </View>

      {/* 기본 상태 + 채운 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Default State + Fill Style
        </Text>
        <Button text="버튼" state="default" variant="fill" />
      </View>

      {/* 클릭 상태 + 채운 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Click State + Fill Style
        </Text>
        <Button text="버튼" state="click" variant="fill" />
      </View>

      {/* 비활성화 상태 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">Disabled State</Text>
        <Button text="버튼" state="disabled" variant="disabled" />
      </View>

      {/* 클릭 상태 + 회색 스타일 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Click State + Weak-Dark Style
        </Text>
        <Button text="버튼" state="click" variant="weakDark" />
      </View>

      {/* 기본 상태 + 클릭 상태 */}
      <View className="mb-6 space-y-2">
        <Text className="text-14 font-pretendard-semibold">
          Default State + Weak-Dark Style
        </Text>
        <Button text="버튼" state="default" variant="weakDark" />
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

      {/* ==== CheckSquare Test ==== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
        CheckSquare Test
      </Text>

      <View className="mb-6 gap-3">
        {/* 토글 테스트 */}
        <CheckSquare
          checked={squareChecked}
          onChange={setSquareChecked}
          label={squareChecked ? "선택됨" : "미선택"}
        />

        {/* 항상 선택 상태 */}
        <CheckSquare checked={true} label="선택된 상태" />

        {/* 항상 미선택 상태 */}
        <CheckSquare checked={false} label="미선택 상태" />

        {/* 비활성화 - 미선택 */}
        <CheckSquare checked={false} disabled label="비활성화 상태" />

        {/* 비활성화 - 선택 */}
        <CheckSquare checked={true} disabled label="비활성화 + 선택" />
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
