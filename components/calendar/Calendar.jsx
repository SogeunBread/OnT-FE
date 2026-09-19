import LeftArrow from "@/components/icons/Left";
import RightArrow from "@/components/icons/Right";
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getWeekOfMonth,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const EVENT_DOT_CLASS = {
  meal: "bg-primary-main",
  exercise: "bg-secondary-blue",
};

// API 연결 전 디자인 상태를 확인하기 위한 임시 데이터입니다.
const DEFAULT_EVENTS = [
  { date: "2026-07-10", type: "meal" },
  { date: "2026-07-11", type: "exercise" },
  { date: "2026-07-12", type: "meal" },
  { date: "2026-07-12", type: "exercise" },
];

const getDateKey = (date) => format(date, "yyyy-MM-dd");

const CalendarHeader = ({ mode, periodDate, onPrevious, onNext }) => {
  const weekStart = startOfWeek(periodDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(periodDate, { weekStartsOn: 1 });
  const title =
    mode === "week"
      ? `${format(periodDate, "yyyy년 M월")} ${getWeekOfMonth(periodDate, {
          weekStartsOn: 1,
        })}주`
      : format(periodDate, "yyyy년 M월");

  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Pressable
        accessibilityLabel={mode === "week" ? "이전 주" : "이전 달"}
        accessibilityRole="button"
        className="h-10 w-10 items-center justify-center"
        hitSlop={4}
        onPress={onPrevious}
      >
        <LeftArrow size={18} color="#B7B7B7" strokeWidth={3} />
      </Pressable>

      <View className="items-center">
        <Text
          className={`${
            mode === "week" ? "text-18" : "text-16"
          } font-pretendard-semibold text-text`}
        >
          {title}
        </Text>
        {mode === "week" && (
          <Text className="mt-1 text-14 font-pretendard-regular text-grayscale-G500">
            {format(weekStart, "M.d (EEE)", { locale: ko })} ~{" "}
            {format(weekEnd, "M.d (EEE)", { locale: ko })}
          </Text>
        )}
      </View>

      <Pressable
        accessibilityLabel={mode === "week" ? "다음 주" : "다음 달"}
        accessibilityRole="button"
        className="h-10 w-10 items-center justify-center"
        hitSlop={4}
        onPress={onNext}
      >
        <RightArrow size={18} color="#B7B7B7" strokeWidth={3} />
      </Pressable>
    </View>
  );
};

const EventDots = ({ events }) => {
  const eventTypes = [...new Set(events.map((event) => event.type || "meal"))];

  return (
    <View className="h-1 flex-row items-center justify-center gap-1">
      {eventTypes.map((type) => (
        <View
          key={type}
          className={`h-1 w-1 rounded-full ${
            EVENT_DOT_CLASS[type] || EVENT_DOT_CLASS.meal
          }`}
        />
      ))}
    </View>
  );
};

const CalendarDay = ({
  date,
  events,
  isCurrentMonth = true,
  isSelected,
  mode,
  onPress,
}) => {
  const isTodayDate = isToday(date);
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
      accessibilityLabel={`${format(date, "yyyy년 M월 d일")}${
        events.length > 0 ? `, 이벤트 ${events.length}개` : ""
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`${
        mode === "week" ? "h-[72px]" : "h-[52px]"
      } flex-1 items-center gap-1 py-1`}
      onPress={onPress}
    >
      {mode === "week" && (
        <Text className="text-12 font-pretendard-regular text-grayscale-G700">
          {WEEKDAYS[(date.getDay() + 6) % 7]}
        </Text>
      )}
      <View
        className={`h-7 w-7 items-center justify-center rounded-full ${backgroundColor}`}
      >
        <Text className={`text-14 ${textColor} ${fontWeight}`}>
          {format(date, "d")}
        </Text>
      </View>
      <EventDots events={events} />
    </Pressable>
  );
};

const Calendar = ({
  defaultSelectedDate = new Date(),
  events = DEFAULT_EVENTS,
  mode = "month",
  onDateSelect,
  selectedDate: controlledSelectedDate,
}) => {
  const [periodDate, setPeriodDate] = useState(
    controlledSelectedDate || defaultSelectedDate,
  );
  const [internalSelectedDate, setInternalSelectedDate] = useState(
    defaultSelectedDate,
  );
  const selectedDate = controlledSelectedDate || internalSelectedDate;
  const isWeekMode = mode === "week";

  const monthStart = startOfMonth(periodDate);
  const monthEnd = endOfMonth(periodDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  const weeks = Array.from(
    { length: Math.ceil(monthDays.length / 7) },
    (_, index) => monthDays.slice(index * 7, index * 7 + 7),
  );
  const weekStart = startOfWeek(periodDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(periodDate, { weekStartsOn: 1 }),
  });

  const eventsByDate = events.reduce((result, event) => {
    const dateEvents = result[event.date] || [];
    return { ...result, [event.date]: [...dateEvents, event] };
  }, {});

  const selectDate = (date) => {
    if (controlledSelectedDate === undefined) {
      setInternalSelectedDate(date);
    }
    onDateSelect?.(date);
  };

  const movePeriod = (direction) => {
    setPeriodDate((date) => {
      if (isWeekMode) {
        return direction === "next" ? addWeeks(date, 1) : subWeeks(date, 1);
      }
      return direction === "next" ? addMonths(date, 1) : subMonths(date, 1);
    });
  };

  const renderDay = (date, isCurrentMonth = true) => (
    <CalendarDay
      key={date.toISOString()}
      date={date}
      events={eventsByDate[getDateKey(date)] || []}
      isCurrentMonth={isCurrentMonth}
      isSelected={isSameDay(date, selectedDate)}
      mode={mode}
      onPress={() => selectDate(date)}
    />
  );

  return (
    <View className="w-full bg-white px-4 pb-3 pt-5">
      <CalendarHeader
        mode={mode}
        periodDate={periodDate}
        onPrevious={() => movePeriod("previous")}
        onNext={() => movePeriod("next")}
      />

      {isWeekMode ? (
        <View className="flex-row items-center border-b border-b-grayscale-G100">
          {weekDays.map((date) => renderDay(date))}
        </View>
      ) : (
        <View>
          <View className="flex-row items-center border-b border-b-grayscale-G100 py-1">
            {WEEKDAYS.map((day) => (
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
              {dates.map((date) =>
                renderDay(date, isSameMonth(date, periodDate)),
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default Calendar;
