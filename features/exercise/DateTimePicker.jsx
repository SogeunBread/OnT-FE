import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { cssInterop } from "nativewind";
import { format } from "date-fns";
import Calendar from "@/components/calendar";
import Field from "@/components/field";
import Button from "@/components/button";
import Sheet from "@/components/exercise/Sheet";
import { isValidDateKey, isValidTime } from "./state";

const SheetInput = cssInterop(BottomSheetTextInput, { className: "style" });
export function PickerField({ label, value, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      className="min-h-11 min-w-0 flex-1"
    >
      <View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Field value={value} className="w-full" tabIndex={-1} />
      </View>
    </Pressable>
  );
}

function TimeForm({ value, onConfirm, onClose, title }) {
  const [hours, setHours] = useState(value?.split(":")[0] ?? "11");
  const [minutes, setMinutes] = useState(value?.split(":")[1] ?? "30");
  const time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  const valid = !!hours && !!minutes && isValidTime(time);
  return (
    <Sheet
      visible
      onClose={onClose}
      initialHeight={240}
      accessibilityLabel={title}
      footer={
        <Button
          text="확인"
          variant="fill"
          disabled={!valid}
          accessibilityRole="button"
          onPress={() => onConfirm(time)}
        />
      }
    >
      <Text className="text-16 font-pretendard-semibold text-text">
        {title}
      </Text>
      <View className="flex-row items-center gap-3">
        <Field
          inputComponent={SheetInput}
          className="w-auto flex-1"
          accessibilityLabel="시"
          keyboardType="number-pad"
          maxLength={2}
          value={hours}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setHours(text);
          }}
        />
        <Text className="text-14 text-text">시</Text>
        <Field
          inputComponent={SheetInput}
          className="w-auto flex-1"
          accessibilityLabel="분"
          keyboardType="number-pad"
          maxLength={2}
          value={minutes}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setMinutes(text);
          }}
        />
        <Text className="text-14 text-text">분</Text>
      </View>
    </Sheet>
  );
}
export default function DateTimePicker({
  picker,
  date,
  startTime,
  endTime,
  onChange,
  onClose,
}) {
  if (!picker) return null;
  if (picker === "date")
    return (
      <Sheet
        visible
        onClose={onClose}
        initialHeight={500}
        accessibilityLabel="운동 날짜 선택"
      >
        <Text className="text-16 font-pretendard-semibold text-text">
          날짜 선택
        </Text>
        <Calendar
          events={[]}
          defaultSelectedDate={
            isValidDateKey(date) ? new Date(`${date}T12:00:00`) : new Date()
          }
          onDateSelect={(value) =>
            onChange({ date: format(value, "yyyy-MM-dd") })
          }
        />
      </Sheet>
    );
  return (
    <TimeForm
      key={picker}
      title={picker === "startTime" ? "시작 시간" : "종료 시간"}
      value={picker === "startTime" ? startTime : endTime}
      onClose={onClose}
      onConfirm={(value) => onChange({ [picker]: value })}
    />
  );
}
