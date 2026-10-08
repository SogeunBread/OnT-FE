import ButtonSmall from "@/components/button/ButtonSmall";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function UserManageTab() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white">
      <Text className="text-20 font-pretendard-semibold text-text">관리</Text>
      <ButtonSmall
        text="기록 추가"
        onPress={() => router.push("/(userTabs)/meal-record")}
      />
    </View>
  );
}
