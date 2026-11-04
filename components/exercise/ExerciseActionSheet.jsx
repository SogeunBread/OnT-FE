import Button from "@/components/button";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { useState } from "react";
import { Text, View } from "react-native";
import Sheet from "./Sheet";
import { metricInfo } from "./exerciseModel";

function ExerciseActions({ exercise, onClose, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const canManage = exercise.isCustom === true;
  return (
    <>
      <Sheet
        visible
        onClose={onClose}
        initialHeight={180}
        accessibilityLabel="사용자 운동 관리"
        footer={
          <View className="flex-row gap-4">
            <Button
              text="수정"
              className="flex-1"
              disabled={!canManage || !onEdit}
              onPress={() => onEdit?.(exercise)}
              accessibilityRole="button"
            />
            <Button
              text="삭제"
              className="flex-1"
              variant="weakDark"
              disabled={!canManage || !onDelete}
              onPress={() => setConfirming(true)}
              accessibilityRole="button"
            />
          </View>
        }
      >
        <View className="gap-0.5">
          <View className="flex-row items-center gap-2">
            <Text className="shrink text-16 font-pretendard-semibold text-text">
              {exercise.name}
            </Text>
            {canManage && (
              <View className="rounded-full bg-primary-50 px-2 py-0.5">
                <Text className="text-12 text-primary-main">MY</Text>
              </View>
            )}
          </View>
          <Text className="text-12 font-pretendard-regular text-grayscale-G500">
            {exercise.category} |{" "}
            {(exercise.metrics ?? [])
              .map((id) => metricInfo(id)?.label ?? id)
              .join(", ")}
          </Text>
        </View>
        <ConfirmDialog
          visible={confirming}
          title={exercise.name}
          content="이 운동을 삭제할까요?"
          confirmText="삭제하기"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onDelete?.(exercise);
          }}
        />
      </Sheet>
    </>
  );
}

export default function ExerciseActionSheet({
  visible = false,
  exercise,
  ...props
}) {
  return visible && exercise ? (
    <ExerciseActions key={exercise.id} exercise={exercise} {...props} />
  ) : null;
}
