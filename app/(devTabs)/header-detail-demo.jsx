import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function HeaderDetailDemoScreen() {
  const { title, subtitle, actionType } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white px-5 py-6">
      <View className="rounded-2xl border border-grayscale-G100 bg-white p-5">
        <Text className="text-18 font-pretendard-bold text-text">
          {title ?? "Header Detail"}
        </Text>
        <Text className="mt-2 text-14 font-pretendard-regular text-grayscale-G600">
          이 화면의 헤더는 `HeaderDetail` 컴포넌트로 렌더링됩니다.
        </Text>
        <Text className="mt-4 text-14 font-pretendard-semibold text-text">
          subtitle: {subtitle ?? "-"}
        </Text>
        <Text className="mt-2 text-14 font-pretendard-semibold text-text">
          actionType: {actionType ?? "heart"}
        </Text>
      </View>
    </View>
  );
}
