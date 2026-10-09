import ButtonSmall from "@/components/button/ButtonSmall";
import Calendar from "@/components/calendar";
import { format, isValid, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function UserManageTab() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(() => {
    const requestedDate = typeof date === "string" ? parseISO(date) : null;
    return requestedDate && isValid(requestedDate) ? requestedDate : new Date();
  });

  useEffect(() => {
    const requestedDate = typeof date === "string" ? parseISO(date) : null;
    if (requestedDate && isValid(requestedDate)) setSelectedDate(requestedDate);
  }, [date]);

  const handlePressAddRecord = () => {
    router.push({
      pathname: "/(userTabs)/meal-record",
      params: { date: format(selectedDate, "yyyy-MM-dd") },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Calendar
        key={format(selectedDate, "yyyy-MM")}
        events={[]}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <View className="flex-row items-center justify-between px-4 pt-3">
        <Text className="text-16 font-pretendard-semibold text-text">
          {format(selectedDate, "yyyy년 M월 d일")}
        </Text>
        <ButtonSmall
          accessibilityLabel="식사 기록 추가"
          accessibilityRole="button"
          text="기록 추가"
          onPress={handlePressAddRecord}
        />
      </View>
    </ScrollView>
  );
}
