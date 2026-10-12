import ButtonSmall from "@/components/button/ButtonSmall";
import Calendar from "@/components/calendar";
import MealCard, { MEAL_CARD_FEEDBACK } from "@/components/meal_card/MealCard";
import MealPhotoViewer from "@/components/meal-record/MealPhotoViewer";
import { useMealRecords } from "@/components/meal-record/MealRecordsContext";
import { canRecordMealOnDate } from "@/components/meal-record/meal-record-date";
import Tab from "@/components/tab";
import { format, isValid, parseISO } from "date-fns";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const BADGE_STYLES = {
  [MEAL_CARD_FEEDBACK.DONE]: { backgroundColor: "rgba(98, 177, 255, 0.3)" },
  [MEAL_CARD_FEEDBACK.WAITING]: { backgroundColor: "rgba(255, 199, 77, 0.3)" },
};

const TAB_STYLE = { flex: 1, height: 45, paddingVertical: 0, justifyContent: "center" };
const CARD_STYLE = { width: "100%", minHeight: 96, boxShadow: "0px 0px 2px rgba(0,0,0,0.1)" };

export default function UserManageTab() {
  const router = useRouter();
  const { records, today } = useMealRecords();
  const [viewerPhotos, setViewerPhotos] = useState(null);
  const { date } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(() => {
    const requestedDate = typeof date === "string" ? parseISO(date) : null;
    return requestedDate && isValid(requestedDate) ? requestedDate : new Date();
  });

  useEffect(() => {
    const requestedDate = typeof date === "string" ? parseISO(date) : null;
    if (requestedDate && isValid(requestedDate)) setSelectedDate(requestedDate);
  }, [date]);

  useFocusEffect(useCallback(() => () => setViewerPhotos(null), []));

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const isFutureDate = !canRecordMealOnDate(selectedDate, today);
  const dailyRecords = useMemo(() => (
    records.filter((record) => record.date === dateKey)
      .sort((first, second) => first.time.localeCompare(second.time))
  ), [records, dateKey]);
  const events = useMemo(() => (
    records.map((record) => ({ date: record.date, type: "meal" }))
  ), [records]);

  const handlePressAddRecord = () => {
    if (!canRecordMealOnDate(selectedDate)) return;
    router.push({
      pathname: "/(userTabs)/meal-record",
      params: { date: format(selectedDate, "yyyy-MM-dd") },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row">
        <Tab text="식단" selected style={TAB_STYLE} />
        <Tab
          text="체중"
          disabled
          textStyle={{ fontFamily: "Pretendard" }}
          style={[TAB_STYLE, { borderBottomWidth: 1, opacity: 1 }]}
        />
      </View>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Calendar
          key={format(selectedDate, "yyyy-MM")}
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          headerStyle={{ height: 24 }}
          rowStyle={{ gap: 6 }}
        />

        <View className="h-[47px] flex-row items-center justify-between px-4 pt-3">
          <Text className="text-16 font-pretendard-semibold text-text">
            {format(selectedDate, "yyyy년 M월 d일")}
          </Text>
          <ButtonSmall
            accessibilityLabel="식사 기록 추가"
            accessibilityRole="button"
            text="기록 추가"
            disabled={isFutureDate}
            accessibilityState={{ disabled: isFutureDate }}
            onPress={handlePressAddRecord}
          />
        </View>

        <View className="gap-4 px-4 pt-4">
          {isFutureDate ? (
            <Text className="text-center text-12 font-pretendard-semibold text-grayscale-G400">
              미래 식사는 기록할 수 없어요.
            </Text>
          ) : dailyRecords.map((record) => (
            <MealCard
              key={record.id}
              title={record.title}
              time={record.time}
              feedback={record.feedback}
              badgeStyle={BADGE_STYLES[record.feedback]}
              thumbnailSource={record.photos[0]?.uri}
              style={CARD_STYLE}
              onPress={record.photos.length ? () => setViewerPhotos(record.photos) : undefined}
              accessibilityLabel={`${record.title}, ${record.time}`}
            />
          ))}
        </View>
      </ScrollView>
      {viewerPhotos && (
        <MealPhotoViewer photos={viewerPhotos} onClose={() => setViewerPhotos(null)} />
      )}
    </View>
  );
}
