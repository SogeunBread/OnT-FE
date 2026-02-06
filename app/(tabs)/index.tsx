import { ScrollView, Text, View } from "react-native";

export default function TypographyTest() {
  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* ===== Font Size & Weight Test ===== */}
      <Text className="mb-4 text-18 font-pretendard-bold text-primary-main">
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
