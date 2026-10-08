import { format, isValid } from "date-fns";
import { ko } from "date-fns/locale/ko";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { Keyboard, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealTimePicker from "./MealTimePicker";
import "react-datepicker/dist/react-datepicker.css";
import "./meal-date-time-picker.css";

registerLocale("ko", ko);

export default function MealDateTimeField({ label, mode, value, onChange }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const isTime = mode === "time";
  const displayFormat = isTime ? "HH:mm" : "yyyy-MM-dd";

  useFocusEffect(useCallback(() => () => setVisible(false), []));

  return (
    <>
      <Pressable
        accessibilityLabel={`${label} 선택, ${format(value, displayFormat)}`}
        accessibilityRole="button"
        aria-expanded={visible}
        className="min-h-11 w-full justify-center rounded-lg border border-grayscale-G300 bg-white px-3 py-2.5"
        onPress={() => {
          Keyboard.dismiss();
          setDraftValue(new Date(value));
          setVisible(true);
        }}
      >
        <Text className="text-14 font-pretendard-regular text-text">
          {format(value, displayFormat)}
        </Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityLabel="선택창 닫기"
            className="absolute inset-0 bg-black/40"
            onPress={() => setVisible(false)}
          />
          <View
            accessibilityViewIsModal
            className="bg-white"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="min-h-14 flex-row items-center justify-between border-b border-grayscale-G100 px-4">
              <Pressable
                accessibilityRole="button"
                className="min-h-11 min-w-11 items-center justify-center"
                onPress={() => setVisible(false)}
              >
                <Text className="text-16 font-pretendard-medium text-text-sub">취소</Text>
              </Pressable>
              <Text className="text-16 font-pretendard-semibold text-text">{label}</Text>
              <Pressable
                accessibilityRole="button"
                className="min-h-11 min-w-11 items-center justify-center"
                onPress={() => {
                  onChange(draftValue);
                  setVisible(false);
                }}
              >
                <Text className="text-16 font-pretendard-semibold text-primary-main">확인</Text>
              </Pressable>
            </View>
            {visible && (
              <View className="px-4 py-3">
                {isTime ? (
                  <MealTimePicker value={draftValue} onChange={setDraftValue} label={label} />
                ) : (
                  <DatePicker
                    inline
                    selected={draftValue}
                    onChange={(selectedValue) => {
                      if (selectedValue && isValid(selectedValue)) {
                        setDraftValue(selectedValue);
                      }
                    }}
                    locale="ko"
                    calendarClassName="meal-date-time-picker"
                    dateFormat={displayFormat}
                    dateFormatCalendar="yyyy년 M월"
                    previousMonthAriaLabel="이전 달"
                    nextMonthAriaLabel="다음 달"
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
