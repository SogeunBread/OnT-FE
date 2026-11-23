import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { cssInterop } from "nativewind";
import Button from "@/components/button";
import Chip from "@/components/chip";
import Field from "@/components/field";
import { useState } from "react";
import { Text, View } from "react-native";
import Sheet from "./Sheet";
import {
  EXERCISE_CATEGORIES,
  EXERCISE_METRICS,
  validateCustomExercise,
} from "./exerciseModel";

const SheetInput = cssInterop(BottomSheetTextInput, { className: "style" });

function CustomExerciseForm({
  onClose,
  initialValue,
  onSubmit,
  busy = false,
  error,
}) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [category, setCategory] = useState(initialValue?.category ?? "하체");
  const [metrics, setMetrics] = useState(initialValue?.metrics ?? ["weight"]);
  const [selectionMessage, setSelectionMessage] = useState("");
  const validation = validateCustomExercise({ name, category, metrics });
  const toggle = (id) => {
    if (metrics.includes(id)) {
      setMetrics(metrics.filter((value) => value !== id));
      setSelectionMessage("");
    } else if (metrics.length < 3) {
      setMetrics([...metrics, id]);
      setSelectionMessage("");
    } else setSelectionMessage("타입은 최대 3개까지 선택할 수 있어요.");
  };
  const submit = () => {
    if (validation || busy || !onSubmit) return;
    onSubmit({
      ...(initialValue?.id !== undefined && { id: initialValue.id }),
      name: name.trim(),
      category,
      metrics: [...metrics],
      isCustom: true,
    });
  };
  return (
    <Sheet
      visible
      dismissible={!busy}
      onClose={busy ? () => {} : onClose}
      initialHeight={482}
      accessibilityLabel={initialValue ? "운동 수정" : "신규 운동 등록"}
      footer={
        <Button
          text={initialValue ? "수정하기" : "등록"}
          variant="fill"
          disabled={!!validation || busy || !onSubmit}
          onPress={submit}
          accessibilityRole="button"
        />
      }
    >
      <View className="gap-1">
        <Text className="text-16 font-pretendard-semibold text-text">
          {initialValue ? "운동 수정" : "신규 등록"}
        </Text>
        <Text className="text-14 font-pretendard-regular text-grayscale-G600">
          리스트에 없는 운동을 수기로 등록할 수 있어요.
        </Text>
      </View>
      <View className="gap-2">
        <Text className="text-14 font-pretendard-semibold text-text">
          운동 이름 <Text className="text-primary-main">*</Text>
        </Text>
        <Field
          inputComponent={SheetInput}
          value={name}
          onChangeText={setName}
          className="w-full"
          placeholder="운동 이름을 입력하세요."
          accessibilityLabel="신규 운동 이름"
          disabled={busy}
        />
      </View>
      <View className="gap-2">
        <Text className="text-14 font-pretendard-semibold text-text">
          카테고리 <Text className="text-primary-main">*</Text>
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {EXERCISE_CATEGORIES.map((value) => (
            <Chip
              key={value}
              text={value}
              selected={category === value}
              disabled={busy}
              accessibilityState={{ selected: category === value }}
              onPress={() => setCategory(value)}
            />
          ))}
        </View>
      </View>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-14 font-pretendard-semibold text-text">
            타입 <Text className="text-primary-main">*</Text>
          </Text>
          <Text className="text-12 text-grayscale-G500">최대 3개</Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {EXERCISE_METRICS.map((metric) => (
            <Chip
              key={metric.id}
              text={metric.label}
              selected={metrics.includes(metric.id)}
              accessibilityLabel={`타입 ${metric.label}`}
              accessibilityState={{ selected: metrics.includes(metric.id) }}
              disabled={busy}
              onPress={() => toggle(metric.id)}
            />
          ))}
        </View>
      </View>
      {!!(error || selectionMessage) && (
        <Text
          accessibilityLiveRegion="polite"
          className="text-12 text-primary-500"
        >
          {error || selectionMessage}
        </Text>
      )}
    </Sheet>
  );
}

export default function CustomExerciseSheet({ visible = false, ...props }) {
  return visible ? (
    <CustomExerciseForm key={props.initialValue?.id ?? "new"} {...props} />
  ) : null;
}
