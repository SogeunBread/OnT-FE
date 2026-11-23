import ButtonSmall from "@/components/button/ButtonSmall";
import WorkoutCard from "@/components/workout_card";
import { Text, View } from "react-native";
import {
  isTimeOnly,
  isValidExerciseDuration,
  metricInfo,
} from "./exerciseModel";

export default function ExerciseEditor({
  records = [],
  onChange,
  onAddExercise,
  disabled = false,
}) {
  const readOnly = disabled || !onChange;
  const update = (id, patch) => {
    if (!readOnly)
      onChange?.(
        records.map((record) =>
          record.id === id ? { ...record, ...patch } : record
        )
      );
  };
  return (
    <View className="w-full gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-14 font-pretendard-semibold text-text">
          운동 목록 <Text className="text-primary-main">*</Text>
        </Text>
        <ButtonSmall
          text="운동 추가"
          accessibilityRole="button"
          disabled={readOnly || !onAddExercise}
          onPress={onAddExercise}
        />
      </View>
      {records.length === 0 && (
        <Text className="py-5 text-center text-12 font-pretendard-regular text-grayscale-G500">
          등록된 운동이 없습니다.
        </Text>
      )}
      {records.map((record, index) => {
        const metrics = record.metrics ?? [];
        const timeOnly = isTimeOnly(record);
        return (
          <View key={record.id} className="gap-1">
            <WorkoutCard
              title={record.name}
              order={index + 1}
              disabled={readOnly}
              variant={
                timeOnly
                  ? "no-type"
                  : ["type-one", "type-two", "type-three"][
                      Math.max(0, metrics.length - 1)
                    ]
              }
              columns={metrics.map((id) => metricInfo(id)?.inputLabel ?? id)}
              sets={(record.sets ?? []).map((set) =>
                metrics.map((id) => set[id] ?? "0")
              )}
              duration={record.duration ?? "00:00:00"}
              onDelete={() => {
                if (!readOnly)
                  onChange?.(records.filter((item) => item.id !== record.id));
              }}
              onDurationChange={(duration) => update(record.id, { duration })}
              onSetsChange={(rows) =>
                update(record.id, {
                  sets: rows.map((values, rowIndex) =>
                    Object.fromEntries(
                      metrics.map((id, column) => {
                        const value = values[column] ?? "0";
                        const valid =
                          id === "weight"
                            ? /^\d*(\.\d*)?$/.test(value)
                            : /^\d*$/.test(value);
                        return [
                          id,
                          valid ? value : record.sets?.[rowIndex]?.[id] ?? "0",
                        ];
                      })
                    )
                  ),
                })
              }
            />
            {timeOnly &&
              !isValidExerciseDuration(record.duration ?? "00:00:00") && (
                <Text
                  accessibilityLiveRegion="polite"
                  className="text-12 text-primary-500"
                >
                  시간은 시:분:초 형식으로 입력해주세요. (예: 00:30:00)
                </Text>
              )}
          </View>
        );
      })}
    </View>
  );
}
