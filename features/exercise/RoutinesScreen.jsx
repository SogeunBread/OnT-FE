import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Routine from "@/components/routine";
import RoutineDetailSheet from "@/components/routine/RoutineDetailSheet";
import RoutineActionSheet from "@/components/routine/RoutineActionSheet";
import Button from "@/components/button";
import {
  cloneExerciseRecords,
  ROUTINE_LIMIT,
} from "@/components/exercise/exerciseModel";
import { useExercise, newExerciseId } from "./ExerciseProvider";
import { draftRoute, exerciseRoutes, firstParam } from "./navigation";
import FlowScaffold from "./FlowScaffold";

export default function RoutinesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { state, send } = useExercise();
  const targetDraftId = firstParam(params.draftId);
  const [sheet, setSheet] = useState(null);
  const [error, setError] = useState("");
  const routine = state.routines.find((item) => item.id === sheet?.id);
  const close = () => setSheet(null);
  const record = (selected) => {
    setError("");
    const targetDraft = state.drafts[targetDraftId];
    if (targetDraftId && (!targetDraft || targetDraft.kind !== "journal")) {
      close();
      setError(
        "작성 중인 일지를 찾을 수 없습니다. 이전 화면에서 다시 시작해주세요."
      );
      return;
    }
    if (targetDraft) {
      const records = cloneExerciseRecords(selected.records).map((item) => ({
        ...item,
        id: newExerciseId("record"),
      }));
      const result = send({
        type: "APPEND_RECORDS",
        id: targetDraft.id,
        records,
      });
      if (!result?.ok) {
        setError(result?.message);
        close();
        return;
      }
      close();
      router.dismissTo(draftRoute(targetDraft));
    } else {
      const id = newExerciseId();
      const result = send({
        type: "OPEN_DRAFT",
        id,
        kind: "journal",
        routineId: selected.id,
      });
      if (!result?.ok) {
        setError(result?.message);
        close();
        return;
      }
      close();
      router.push({
        pathname: exerciseRoutes.journalNew,
        params: { draftId: id },
      });
    }
  };
  return (
    <FlowScaffold
      title="루틴함"
      footer={
        <Button
          text={`루틴 추가하기 (${state.routines.length}/${ROUTINE_LIMIT})`}
          variant="fill"
          disabled={!state.ready || state.routines.length >= ROUTINE_LIMIT}
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: exerciseRoutes.routineNew,
              params: targetDraftId ? { returnDraftId: targetDraftId } : {},
            })
          }
        />
      }
    >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {!!error && (
          <Text
            accessibilityLiveRegion="polite"
            className="text-14 text-primary-500"
          >
            {error}
          </Text>
        )}
        {!state.ready ? (
          <Text className="text-center text-14 text-grayscale-G500">
            불러오는 중입니다.
          </Text>
        ) : !state.routines.length ? (
          <Text className="text-center text-16 font-pretendard-regular text-grayscale-G500">
            등록된 루틴이 없어요.
          </Text>
        ) : (
          state.routines.map((item) => (
            <Routine
              key={item.id}
              routineName={item.name}
              trainer={item.trainerAssigned}
              exerciseCount={item.records.length}
              onPress={() => setSheet({ type: "detail", id: item.id })}
              onPressMore={() => setSheet({ type: "actions", id: item.id })}
            />
          ))
        )}
      </ScrollView>
      <RoutineDetailSheet
        visible={sheet?.type === "detail"}
        routine={routine}
        onClose={close}
        onRecord={record}
      />
      <RoutineActionSheet
        visible={sheet?.type === "actions"}
        routine={routine}
        onClose={close}
        onEdit={(item) => {
          close();
          router.push({
            pathname: "/(exerciseFlow)/routines/[id]/edit",
            params: {
              id: item.id,
              ...(targetDraftId && { returnDraftId: targetDraftId }),
            },
          });
        }}
        onDelete={(item) => {
          send({ type: "DELETE_ROUTINE", id: item.id });
          close();
        }}
      />
    </FlowScaffold>
  );
}
