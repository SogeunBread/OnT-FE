import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ExerciseSelection from "@/components/exercise/ExerciseSelection";
import CustomExerciseSheet from "@/components/exercise/CustomExerciseSheet";
import ExerciseActionSheet from "@/components/exercise/ExerciseActionSheet";
import { createExerciseRecord } from "@/components/exercise/exerciseModel";
import { useExercise, newExerciseId } from "./ExerciseProvider";
import { draftRoute, firstParam } from "./navigation";
import FlowScaffold, { FlowMessage } from "./FlowScaffold";

export default function ExerciseSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { state, send } = useExercise();
  const draftId = firstParam(params.draftId);
  const draft = state.drafts[draftId];
  const [selectedIds, setSelectedIds] = useState([]);
  const [manageId, setManageId] = useState(null);
  const [customMode, setCustomMode] = useState(null);
  const [error, setError] = useState("");
  const submitted = useRef(false);
  const managedExercise = state.exercises.find((item) => item.id === manageId);
  const back = () =>
    draft
      ? router.canGoBack()
        ? router.back()
        : router.replace(draftRoute(draft))
      : router.back();
  const submit = (exercise) => {
    const result = send({
      type: "SAVE_EXERCISE",
      exercise: { ...exercise, id: exercise.id ?? newExerciseId("custom") },
    });
    if (!result?.ok) {
      setError(result?.message || "운동을 저장하지 못했습니다.");
      return;
    }
    setCustomMode(null);
    setManageId(null);
    setError("");
  };
  const custom = (
    <CustomExerciseSheet
      visible={!!customMode}
      initialValue={customMode === "edit" ? managedExercise : undefined}
      onClose={() => {
        setCustomMode(null);
        setError("");
      }}
      error={error}
      onSubmit={submit}
    />
  );
  if (!state.ready || !draft)
    return (
      <FlowScaffold title="운동 선택">
        <FlowMessage
          message={
            !state.ready
              ? "불러오는 중입니다."
              : "작성 중인 내용이 없습니다. 운동일지나 루틴 작성 화면에서 운동을 추가해주세요."
          }
          onBack={!state.ready ? false : undefined}
        />
      </FlowScaffold>
    );
  return (
    <FlowScaffold title="운동 선택" onBack={back}>
      {!!error && !customMode && (
        <View className="px-4 pb-2">
          <Text
            accessibilityLiveRegion="polite"
            className="text-12 text-primary-500"
          >
            {error}
          </Text>
        </View>
      )}
      <ExerciseSelection
        exercises={state.exercises}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onCreateExercise={() => {
          setError("");
          setCustomMode("new");
        }}
        onManageExercise={(item) => setManageId(item.id)}
        onConfirm={(selected) => {
          if (submitted.current) return;
          const result = send({
            type: "APPEND_RECORDS",
            id: draftId,
            records: selected.map(createExerciseRecord),
          });
          if (!result?.ok) {
            setError(result?.message);
            return;
          }
          submitted.current = true;
          back();
        }}
      />
      <ExerciseActionSheet
        visible={!!managedExercise}
        exercise={managedExercise}
        onClose={() => {
          setManageId(null);
          setCustomMode(null);
        }}
        onEdit={() => {
          setError("");
          setCustomMode("edit");
        }}
        onDelete={(item) => {
          const result = send({ type: "DELETE_EXERCISE", id: item.id });
          if (!result?.ok) {
            setError(result?.message);
            return;
          }
          setSelectedIds((ids) => ids.filter((id) => id !== item.id));
          setManageId(null);
        }}
      >
        {customMode === "edit" && custom}
      </ExerciseActionSheet>
      {customMode === "new" && custom}
    </FlowScaffold>
  );
}
