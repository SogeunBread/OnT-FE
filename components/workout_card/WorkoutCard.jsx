import Delete from "@/assets/figma/delete.svg";
import { colors } from "@/tailwind.config";
import Button from "@/components/button";
import Field from "@/components/field";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const COLUMN_COUNTS = { "type-one": 1, "type-two": 2, "type-three": 3 };

// sets is an array of rows, each row containing the displayed string values.
export default function WorkoutCard({
  variant = "type-one",
  title = "운동 이름",
  order = 1,
  columns,
  sets,
  defaultSets,
  onSetsChange,
  duration,
  defaultDuration = "00:00:00",
  onDurationChange,
  onDelete,
  className = "",
}) {
  const count = COLUMN_COUNTS[variant] ?? 1;
  const labels = columns ?? Array.from({ length: count }, () => "타이틀");
  const [internalSets, setInternalSets] = useState(
    () => defaultSets ?? Array.from({ length: 3 }, () => Array(count).fill("0"))
  );
  const [internalDuration, setInternalDuration] = useState(defaultDuration);
  const rows = sets ?? internalSets;
  const update = (next) => {
    if (sets === undefined) setInternalSets(next);
    onSetsChange?.(next);
  };
  const updateCell = (row, column, text) =>
    update(
      rows.map((values, index) =>
        index === row
          ? Array.from({ length: count }, (_, i) =>
              i === column ? text : values[i] ?? "0"
            )
          : values
      )
    );
  return (
    <View
      className={`w-full gap-3 rounded-md bg-grayscale-G100/30 p-3 ${className}`}
    >
      <View className="flex-row items-center justify-between border-b border-grayscale-G200 pb-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Text className="text-18 font-pretendard-bold text-primary-main">
            {order}
          </Text>
          <Text
            numberOfLines={1}
            className="shrink text-16 font-pretendard-medium text-text"
          >
            {title}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title} 삭제`}
          onPress={onDelete}
          hitSlop={8}
        >
          <Delete />
        </Pressable>
      </View>
      {variant === "no-type" ? (
        <Field
          value={duration ?? internalDuration}
          accessibilityLabel={`${title} 운동 시간`}
          inputClassName="text-right"
          className="w-full"
          onChangeText={(text) => {
            if (duration === undefined) setInternalDuration(text);
            onDurationChange?.(text);
          }}
        />
      ) : (
        <>
          <View className="flex-row gap-3">
            <View className="w-11" />
            <View
              className={`flex-1 flex-row gap-2.5 ${
                count === 1 ? "justify-end" : ""
              }`}
            >
              {Array.from({ length: count }, (_, i) => (
                <Text
                  key={i}
                  className={`text-right text-14 font-pretendard-semibold text-text ${
                    count === 1 ? "w-[86px]" : "flex-1"
                  }`}
                >
                  {labels[i]}
                </Text>
              ))}
            </View>
          </View>
          {rows.map((values, row) => (
            <View key={row} className="flex-row items-center gap-3">
              <Text className="w-11 text-16 font-pretendard-semibold text-grayscale-G900">
                {row + 1}세트
              </Text>
              <View className="min-w-0 flex-1 flex-row gap-2.5">
                {Array.from({ length: count }, (_, column) => (
                  <Field
                    key={column}
                    className="w-auto min-w-0 flex-1"
                    inputClassName="text-right"
                    value={values[column] ?? "0"}
                    keyboardType="decimal-pad"
                    accessibilityLabel={`${title} ${row + 1}세트 ${
                      labels[column]
                    } ${column + 1}`}
                    onChangeText={(text) => updateCell(row, column, text)}
                  />
                ))}
              </View>
            </View>
          ))}
          <View className="flex-row gap-3">
            <Button
              text="세트 삭제"
              style={{ backgroundColor: colors.grayscale.G50 }}
              variant="weakDark"
              className="flex-1"
              accessibilityRole="button"
              disabled={rows.length === 0}
              onPress={() => update(rows.slice(0, -1))}
            />
            <Button
              text="세트 추가"
              className="flex-1"
              accessibilityRole="button"
              onPress={() => update([...rows, Array(count).fill("0")])}
            />
          </View>
        </>
      )}
    </View>
  );
}
