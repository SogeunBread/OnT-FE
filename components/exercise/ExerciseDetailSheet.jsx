import Button from "@/components/button";
import { Text, View } from "react-native";
import { colors } from "@/tailwind.config";
import ExerciseRecordList from "./ExerciseRecordList";
import Sheet from "./Sheet";

export default function ExerciseDetailSheet({
  visible,
  onClose,
  type = "exercise",
  title,
  dateLabel,
  sessionLabel,
  records = [],
  memo = "",
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  initialHeight,
}) {
  const edit = canEdit && !!onEdit;
  const remove = canDelete && type !== "pt" && !!onDelete;
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      initialHeight={initialHeight}
      accessibilityLabel="운동 기록 상세"
      header={
        <View className="gap-1">
          {!!dateLabel && (
            <Text className="text-12 font-pretendard-regular text-grayscale-G700">
              {dateLabel}
            </Text>
          )}
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <Text className="shrink text-18 font-pretendard-bold text-text">
              {title}
            </Text>
            {type === "pt" && !!sessionLabel && (
              <Text className="text-14 font-pretendard-semibold text-secondary-blue">
                {sessionLabel}
              </Text>
            )}
          </View>
        </View>
      }
      footer={
        (edit || remove) && (
          <View className="flex-row gap-4">
            {edit && (
              <Button
                text="수정"
                className="flex-1"
                accessibilityRole="button"
                onPress={onEdit}
              />
            )}
            {remove && (
              <Button
                text="삭제"
                variant="weakDark"
                style={{ backgroundColor: colors.grayscale.G50 }}
                className="flex-1"
                accessibilityRole="button"
                onPress={onDelete}
              />
            )}
          </View>
        )
      }
    >
      <ExerciseRecordList records={records} />
      <View className="gap-2 border-t border-grayscale-G100 pt-4">
        <Text className="text-14 font-pretendard-semibold text-text">메모</Text>
        <Text
          className={`text-14 font-pretendard-regular ${
            memo ? "text-text" : "text-grayscale-G400"
          }`}
        >
          {memo || "아직 작성된 메모가 없습니다."}
        </Text>
      </View>
    </Sheet>
  );
}
