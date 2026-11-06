import Calendar from "@/components/calendar";
import PTScheduleCard from "@/components/pt_schedule_card";
import {
  TRAINER_HOME_INITIAL_DATE,
  trainerHomeNotifications,
  trainerHomeSchedules,
} from "@/constants/trainerHome";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const scheduleEvents = trainerHomeSchedules.map(({ date }) => ({ date }));

const NotificationBadge = ({ label, count, onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${label} ${count}건`}
    className="flex-row items-center gap-1 rounded-full border border-grayscale-G100 bg-white py-1.5 pl-2.5 pr-1.5"
    onPress={onPress}
    hitSlop={{ top: 5, bottom: 5 }}
  >
    <Text className="text-12 font-pretendard-semibold text-text">{label}</Text>
    <View className="h-5 min-w-5 items-center justify-center rounded-full bg-primary-main px-1">
      <Text className="text-[10px] leading-[15px] font-pretendard-semibold text-white">
        {count}
      </Text>
    </View>
  </Pressable>
);

export default function TrainerHomeTab() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(() =>
    parseISO(TRAINER_HOME_INITIAL_DATE),
  );
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const schedules = trainerHomeSchedules
    .filter((schedule) => schedule.date === dateKey)
    .sort((first, second) => first.startTime.localeCompare(second.startTime));

  return (
    <View className="flex-1 bg-white">
      <Calendar
        compact
        mode="week"
        selectedTone="primary"
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onPeriodChange={setSelectedDate}
        events={scheduleEvents}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingTop: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap items-center gap-2">
          <NotificationBadge
            label="신규 상담"
            count={trainerHomeNotifications.newConsultations}
            onPress={() => router.push("/(trainer)/consultation-requests")}
          />
          <NotificationBadge
            label="식단 피드백"
            count={trainerHomeNotifications.pendingMealFeedback}
            onPress={() => router.push("/(trainer)/meal-feedback")}
          />
        </View>
        <View className="mt-3 gap-3">
          <Text
            accessibilityRole="header"
            className="text-16 font-pretendard-semibold text-text"
          >
            {format(selectedDate, "M월 d일")}
          </Text>
          <View className="gap-4">
            {schedules.length === 0 ? (
              <Text className="py-8 text-center text-14 font-pretendard-regular text-grayscale-G500">
                등록된 PT 일정이 없어요.
              </Text>
            ) : (
              schedules.map((schedule) => (
                <PTScheduleCard key={schedule.id} {...schedule} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

