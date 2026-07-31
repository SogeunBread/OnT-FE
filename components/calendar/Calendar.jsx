import LeftArrow from "@/components/icons/Left";
import RightArrow from "@/components/icons/Right";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const week = ["월", "화", "수", "목", "금", "토", "일"];
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, index) =>
    days.slice(index * 7, index * 7 + 7),
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  // TODO: 추후 서버/API에서 받아온 이벤트 데이터로 교체
  const events = [
    { date: "2026-07-10" },
    { date: "2026-07-11" },
    { date: "2026-07-12" },
  ];

  return (
    <View className="w-full bg-white px-4 pb-3 pt-5">
      <View className="mb-4 flex-row items-center justify-between px-2">
        <Pressable
          className="h-[18px] w-[18px]"
          onPress={() => setCurrentMonth((month) => subMonths(month, 1))}
        >
          <LeftArrow size={18} color="#B7B7B7" strokeWidth={3} />
        </Pressable>

        <Text className="text-16 font-pretendard-semibold text-text">
          {format(currentMonth, "yyyy년 M월")}
        </Text>

        <Pressable
          className="h-[18px] w-[18px]"
          onPress={() => setCurrentMonth((month) => addMonths(month, 1))}
        >
          <RightArrow size={18} color="#B7B7B7" strokeWidth={3} />
        </Pressable>
      </View>

      <View>
        <View className="flex-row items-center border-b border-b-grayscale-G100 py-1">
          {week.map((day) => (
            <Text
              key={day}
              className="flex-1 text-center text-12 font-pretendard-regular text-grayscale-G700"
            >
              {day}
            </Text>
          ))}
        </View>

        {weeks.map((dates) => (
          <View
            key={dates[0].toISOString()}
            className="flex-row items-center border-b border-b-grayscale-G100"
          >
            {dates.map((date) => {
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isTodayDate = isToday(date);
              const isSelected = isSameDay(date, selectedDate);

              // TODO: 추후 해당 날짜의 실제 이벤트 데이터와 연결
              const hasEvent = events.some(
                (event) => event.date === format(date, "yyyy-MM-dd"),
              );

              const textColor = isSelected
                ? "text-white"
                : isTodayDate
                ? "text-primary-main"
                : isCurrentMonth
                ? "text-text"
                : "text-grayscale-G300";

              const backgroundColor = isSelected
                ? isTodayDate
                  ? "bg-primary-main"
                  : "bg-grayscale-G300"
                : "bg-transparent";

              const fontWeight =
                isSelected || isTodayDate
                  ? "font-pretendard-semibold"
                  : "font-pretendard-regular";

              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => setSelectedDate(date)}
                  className="h-[52px] flex-1 items-center gap-1 py-1"
                >
                  <View
                    className={`h-7 w-7 items-center justify-center rounded-[20px] ${backgroundColor}`}
                  >
                    <Text className={`text-14 ${textColor} ${fontWeight}`}>
                      {format(date, "d")}
                    </Text>
                  </View>

                  {hasEvent && (
                    <View className="h-1 w-1 rounded-full bg-primary-main" />
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Calendar;
