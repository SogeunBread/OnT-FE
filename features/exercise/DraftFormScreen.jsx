import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Field from "@/components/field";
import FieldLong from "@/components/field-long";
import Button from "@/components/button";
import ExerciseEditor from "@/components/exercise/ExerciseEditor";
import { newExerciseId, useExercise } from "./ExerciseProvider";
import { validateDraft } from "./state";
import { exerciseRoutes, firstParam } from "./navigation";
import FlowScaffold, { FlowMessage } from "./FlowScaffold";
import useDraftNavigation from "./useDraftNavigation";
import DateTimePicker, { PickerField } from "./DateTimePicker";

function Label({ children, count, required = false }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-14 font-pretendard-semibold text-text">
        {children}
        {required && <Text className="text-primary-main"> *</Text>}
      </Text>
      {count !== undefined && (
        <Text className="text-12 font-pretendard-regular text-grayscale-G500">
          {count}
        </Text>
      )}
    </View>
  );
}

export default function DraftFormScreen({ kind, sourceId }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { state, send } = useExercise();
  const suppliedId = firstParam(params.draftId);
  const [draftId] = useState(() => suppliedId || newExerciseId());
  const started = useRef(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(null);
  const draft = state.drafts[draftId];
  const returnDraftId = firstParam(params.returnDraftId);
  const validIdentity =
    draft?.kind === kind && (draft?.sourceId ?? null) === (sourceId ?? null);
  const activeDraft = validIdentity ? draft : null;
  const { dialog, allowNavigation } = useDraftNavigation(activeDraft);
  useEffect(() => {
    if (!state.ready || started.current) return;
    started.current = true;
    if (suppliedId) {
      if (!state.drafts[suppliedId])
        setError("작성 중인 내용이 만료되었습니다. 새로 작성해주세요.");
      return;
    }
    const result = send({
      type: "OPEN_DRAFT",
      id: draftId,
      kind,
      sourceId,
      date: firstParam(params.date),
    });
    if (!result?.ok) setError(result?.message || "작성 화면을 열 수 없습니다.");
    else router.setParams({ draftId });
  }, [
    state.ready,
    draftId,
    kind,
    sourceId,
    suppliedId,
    params.date,
    send,
    router,
    state.drafts,
  ]);
  const fallback =
    kind === "routine"
      ? {
          pathname: exerciseRoutes.routineList,
          params: returnDraftId ? { draftId: returnDraftId } : {},
        }
      : exerciseRoutes.home;
  const back = () =>
    router.canGoBack() ? router.back() : router.replace(fallback);
  const title =
    kind === "routine"
      ? sourceId
        ? "루틴 수정"
        : "루틴 등록"
      : kind === "pt"
      ? `${
          state.sessions.find((item) => item.id === sourceId)?.trainerName ??
          "트레이너"
        } PT`
      : "운동일지 기록";
  const patch = (values) => {
    setError("");
    send({ type: "PATCH_DRAFT", id: draftId, patch: values });
  };
  const validation = activeDraft ? validateDraft(activeDraft) : "";
  const save = () => {
    const result = send({
      type: "SAVE_DRAFT",
      id: draftId,
      savedId: newExerciseId(kind),
    });
    if (!result?.ok) {
      setError(result?.message || "저장하지 못했습니다.");
      return;
    }
    allowNavigation();
    router.dismissTo(
      sourceId && kind !== "routine"
        ? {
            pathname: exerciseRoutes.home,
            params: {
              recordId: result.savedId,
              recordType: kind === "pt" ? "pt" : "exercise",
            },
          }
        : fallback
    );
  };
  if (!state.ready)
    return (
      <FlowScaffold title={title}>
        <FlowMessage message="불러오는 중입니다." onBack={false} />
      </FlowScaffold>
    );
  if (!activeDraft)
    return (
      <FlowScaffold title={title} onBack={back}>
        <FlowMessage
          message={error || "작성 중인 내용을 찾을 수 없습니다."}
          onBack={back}
        />
      </FlowScaffold>
    );
  return (
    <FlowScaffold
      title={title}
      onBack={back}
      keyboard
      footer={
        <View className="flex-row gap-4">
          {kind === "journal" && (
            <View className="flex-1">
              <Button
                text="루틴함"
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: exerciseRoutes.routineList,
                    params: { draftId },
                  })
                }
              />
            </View>
          )}
          <View className={kind === "journal" ? "flex-[2]" : "flex-1"}>
            <Button
              text={
                kind === "routine"
                  ? sourceId
                    ? "수정하기"
                    : "루틴 추가"
                  : sourceId
                  ? "수정하기"
                  : "등록"
              }
              variant="fill"
              accessibilityRole="button"
              disabled={!!validation}
              onPress={save}
            />
          </View>
        </View>
      }
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingTop: 12, gap: 16 }}
      >
        {kind !== "pt" && (
          <View className="gap-2">
            <Label count={`${activeDraft.title.length}/20`} required>
              {kind === "routine" ? "루틴 제목" : "제목"}
            </Label>
            <Field
              className="w-full"
              accessibilityLabel={
                kind === "routine" ? "루틴 제목" : "일지 제목"
              }
              value={activeDraft.title}
              onChangeText={(title) => patch({ title })}
              maxLength={20}
              placeholder={kind === "routine" ? "예: 상체A" : "예: 유산소"}
            />
          </View>
        )}
        {kind === "journal" && (
          <>
            <View className="gap-2">
              <Label required>날짜</Label>
              <PickerField
                label="날짜 선택"
                value={activeDraft.date}
                onPress={() => setPicker("date")}
              />
            </View>
            <View className="gap-2">
              <Label required>운동 시간</Label>
              <View className="flex-row items-center gap-2">
                <PickerField
                  label="시작 시간"
                  value={activeDraft.startTime}
                  onPress={() => setPicker("startTime")}
                />
                <Text className="text-14 text-grayscale-G700">~</Text>
                <PickerField
                  label="종료 시간"
                  value={activeDraft.endTime}
                  onPress={() => setPicker("endTime")}
                />
              </View>
            </View>
          </>
        )}
        <ExerciseEditor
          records={activeDraft.records}
          onChange={(records) => patch({ records })}
          onAddExercise={() =>
            router.push({
              pathname: exerciseRoutes.selection,
              params: { draftId },
            })
          }
        />
        {kind !== "routine" && (
          <View className="gap-2">
            <Label count={`${activeDraft.memo.length}/200`}>메모</Label>
            <FieldLong
              className="w-full max-w-full"
              value={activeDraft.memo}
              onChangeText={(memo) => patch({ memo })}
              accessibilityLabel="운동 메모"
              maxLength={200}
              placeholder="오늘 운동에 대한 전반적인 느낌, 컨디션 등을 기록"
            />
          </View>
        )}
        {!!(
          error ||
          (activeDraft.dirty &&
            activeDraft.title.trim() &&
            activeDraft.records.length &&
            validation)
        ) && (
          <Text
            accessibilityLiveRegion="polite"
            className="text-12 font-pretendard-regular text-primary-500"
          >
            {error || validation}
          </Text>
        )}
      </ScrollView>
      <DateTimePicker
        picker={picker}
        date={activeDraft.date}
        startTime={activeDraft.startTime}
        endTime={activeDraft.endTime}
        onClose={() => setPicker(null)}
        onChange={(values) => {
          patch(values);
          setPicker(null);
        }}
      />
      {dialog}
    </FlowScaffold>
  );
}
