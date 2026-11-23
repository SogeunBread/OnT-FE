import Button from "@/components/button";
import ExerciseRecordList from "@/components/exercise/ExerciseRecordList";
import Sheet from "@/components/exercise/Sheet";
import { Text, View } from "react-native";

export default function RoutineDetailSheet({
  visible = false,
  routine,
  onClose,
  onRecord,
  initialHeight,
}) {
  if (!routine) return null;
  const records = routine.records ?? [];
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      initialHeight={initialHeight}
      accessibilityLabel="루틴 상세"
      header={
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="shrink text-18 font-pretendard-bold text-text">
            {routine.name}
          </Text>
          {routine.trainerAssigned && (
            <View className="rounded-md bg-secondary-blue/10 px-2 py-0.5">
              <Text className="text-12 font-pretendard-semibold text-secondary-blue">
                트레이너 지정
              </Text>
            </View>
          )}
          <Text className="ml-auto text-14 font-pretendard-regular text-grayscale-G600">
            {records.length}개의 운동
          </Text>
        </View>
      }
      footer={
        <Button
          text="일지 기록"
          variant="fill"
          disabled={!records.length || !onRecord}
          accessibilityRole="button"
          onPress={() => onRecord?.(routine)}
        />
      }
    >
      <ExerciseRecordList records={records} />
    </Sheet>
  );
}
