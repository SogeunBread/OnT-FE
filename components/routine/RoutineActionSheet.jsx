import Alert from "@/assets/figma/routine-alert.svg";
import Button from "@/components/button";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import Sheet from "@/components/exercise/Sheet";
import { useState } from "react";
import { Text, View } from "react-native";

function RoutineActions({
  routine,
  onClose,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) {
  const [confirming, setConfirming] = useState(false);
  const editable = canEdit && !routine.trainerAssigned && !!onEdit;
  return (
    <>
      <Sheet
        visible
        onClose={onClose}
        initialHeight={180}
        accessibilityLabel="루틴 관리"
        footer={
          <View className="flex-row gap-4">
            <Button
              text="수정"
              className="flex-1"
              disabled={!editable}
              accessibilityRole="button"
              onPress={() => {
                if (editable) onEdit(routine);
              }}
            />
            <Button
              text="삭제"
              variant="weakDark"
              className="flex-1"
              disabled={!canDelete || !onDelete}
              accessibilityRole="button"
              onPress={() => setConfirming(true)}
            />
          </View>
        }
      >
        <View className="gap-0.5">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="shrink text-16 font-pretendard-semibold text-text">
              {routine.name}
            </Text>
            {routine.trainerAssigned && (
              <View className="rounded-md bg-secondary-blue/10 px-2 py-0.5">
                <Text className="text-12 font-pretendard-semibold text-secondary-blue">
                  트레이너 지정
                </Text>
              </View>
            )}
          </View>
          <Text className="text-12 font-pretendard-regular text-grayscale-G500">
            {routine.records?.length ?? 0}개의 운동
          </Text>
        </View>
        <ConfirmDialog
          visible={confirming}
          title={routine.name}
          icon={routine.trainerAssigned ? <Alert /> : undefined}
          content={
            routine.trainerAssigned
              ? "이 루틴은 트레이너가 지정한 루틴이에요.\n정말 삭제할까요?"
              : "이 루틴을 삭제할까요?"
          }
          confirmText="삭제하기"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onDelete?.(routine);
          }}
        />
      </Sheet>
    </>
  );
}

export default function RoutineActionSheet({
  visible = false,
  routine,
  ...props
}) {
  return visible && routine ? (
    <RoutineActions key={routine.id} routine={routine} {...props} />
  ) : null;
}
