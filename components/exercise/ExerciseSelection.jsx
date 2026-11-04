import CheckIcon from "@/assets/figma/exercise-check.svg";
import More from "@/assets/figma/more.svg";
import ButtonTwo from "@/components/button/ButtonTwo";
import CheckSquare from "@/components/check/CheckSquare";
import ChipArea from "@/components/chip/ChipArea";
import FieldSearch from "@/components/field/FieldSearch";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { EXERCISE_CATEGORIES } from "./exerciseModel";

export default function ExerciseSelection({
  exercises = [],
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  onConfirm,
  onCreateExercise,
  onManageExercise,
  disabled = false,
}) {
  const [internalIds, setInternalIds] = useState(defaultSelectedIds);
  const [query, setQuery] = useState("");
  const selected = selectedIds ?? internalIds;
  const selectedExercises = selected
    .map((id) => exercises.find((item) => item.id === id))
    .filter(Boolean);
  const filtered = exercises.filter((item) =>
    item.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );
  const categories = [
    ...new Set([
      ...EXERCISE_CATEGORIES,
      ...filtered.map((item) => item.category),
    ]),
  ];
  const toggle = (id) => {
    if (disabled) return;
    const next = selected.includes(id)
      ? selected.filter((value) => value !== id)
      : [...selected, id];
    if (selectedIds === undefined) setInternalIds(next);
    onSelectionChange?.(next);
  };
  return (
    <View className="min-h-0 flex-1 bg-white">
      <View className="px-4 pb-3">
        <FieldSearch
          className="w-full"
          placeholder="운동 이름 검색"
          accessibilityLabel="운동 이름 검색"
          value={query}
          onChangeText={setQuery}
          disabled={disabled}
        />
      </View>
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        {categories.map((category) => {
          const items = filtered.filter((item) => item.category === category);
          if (!items.length) return null;
          return (
            <View key={category} className="py-2">
              <Text className="px-4 pb-1 text-14 font-pretendard-semibold text-text">
                {category}
              </Text>
              {items.map((exercise) => (
                <View
                  key={exercise.id}
                  className="flex-row items-center px-4 py-2"
                >
                  <CheckSquare
                    label={exercise.name}
                    className="min-w-0 flex-1 gap-3"
                    labelClassName="shrink font-pretendard-regular"
                    checked={selected.includes(exercise.id)}
                    checkIcon={CheckIcon}
                    disabled={disabled}
                    onChange={() => toggle(exercise.id)}
                  />
                  {exercise.isCustom && (
                    <View className="ml-3 rounded-full bg-primary-50 px-2 py-0.5">
                      <Text className="text-12 text-primary-main">MY</Text>
                    </View>
                  )}
                  {exercise.isCustom && !!onManageExercise && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${exercise.name} 관리`}
                      hitSlop={8}
                      disabled={disabled}
                      onPress={() => onManageExercise(exercise)}
                      className="ml-auto pl-3"
                    >
                      <More />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          );
        })}
        {!filtered.length && (
          <Text className="px-4 py-8 text-center text-14 text-grayscale-G500">
            검색 결과가 없습니다.
          </Text>
        )}
      </ScrollView>
      {selectedExercises.length > 0 && (
        <View className="gap-3 border-t border-grayscale-G100 px-4 py-3">
          <Text className="text-12 font-pretendard-semibold text-text">
            선택한 운동{" "}
            <Text className="text-primary-main">
              {" "}
              {selectedExercises.length}개
            </Text>
          </Text>
          <ScrollView
            nestedScrollEnabled
            horizontal
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 8 }}
          >
            {selectedExercises.map((exercise) => (
              <ChipArea
                key={exercise.id}
                text={exercise.name}
                disabled={disabled}
                closeAccessibilityLabel={`${exercise.name} 선택 해제`}
                onClose={() => toggle(exercise.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}
      <ButtonTwo
        prevText="신규 등록"
        nextText="추가하기"
        prevDisabled={disabled || !onCreateExercise}
        nextDisabled={disabled || !selectedExercises.length || !onConfirm}
        onPrevPress={onCreateExercise}
        onNextPress={() => onConfirm?.(selectedExercises)}
      />
    </View>
  );
}
