import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Keyboard, Modal, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealTimePicker from "./MealTimePicker";

export default function MealDateTimeField({ label, mode, value, onChange }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const displayValue = format(value, mode === "date" ? "yyyy-MM-dd" : "HH:mm");

  useFocusEffect(useCallback(() => () => {
    setVisible(false);
    if (Platform.OS === "android" && mode === "date") DateTimePickerAndroid.dismiss(mode);
  }, [mode]));

  const openPicker = () => {
    Keyboard.dismiss();
    if (Platform.OS === "android" && mode === "date") {
      DateTimePickerAndroid.open({
        value,
        mode,
        display: "calendar",
        is24Hour: true,
        positiveButton: { label: "확인", textColor: "#FF795E" },
        negativeButton: { label: "취소", textColor: "#707070" },
        onChange: (event, selectedValue) => {
          if (event.type === "set" && selectedValue) onChange(selectedValue);
        },
      });
      return;
    }

    setDraftValue(new Date(value));
    setVisible(true);
  };

  return (
    <>
      <Pressable
        accessibilityLabel={`${label} 선택, ${displayValue}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: visible }}
        className="min-h-11 w-full flex-row items-center justify-between gap-2 rounded-lg border border-grayscale-G300 bg-white px-3 py-2.5"
        onPress={openPicker}
      >
        <Text className="flex-1 text-14 font-pretendard-regular text-text" numberOfLines={1}>
          {displayValue}
        </Text>
      </Pressable>

      {(Platform.OS === "ios" || mode === "time") && (
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
              {visible && (mode === "time" ? (
                <View className="px-4 py-3">
                  <MealTimePicker value={draftValue} onChange={setDraftValue} label={label} />
                </View>
              ) : (
                <DateTimePicker
                  value={draftValue}
                  mode={mode}
                  display="inline"
                  locale="ko-KR"
                  themeVariant="light"
                  accentColor="#FF795E"
                  style={{ width: "100%", height: 350 }}
                  onChange={(_, selectedValue) => {
                    if (selectedValue) setDraftValue(selectedValue);
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
