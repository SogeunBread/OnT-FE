import Calendar from "@/components/calendar";
import { Text, View } from "react-native";

export default function CalendarTestScreen() {
  return (
    <View className="flex-1 bg-white px-5 pt-16">
      <Text className="mb-6 text-24 font-pretendard-bold text-text">
        Calendar Test
      </Text>
      <Calendar />
    </View>
  );
}
