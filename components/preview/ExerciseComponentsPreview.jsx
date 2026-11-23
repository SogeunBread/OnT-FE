import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/button";
import Routine from "@/components/routine";
import RoutineActionSheet from "@/components/routine/RoutineActionSheet";
import RoutineDetailSheet from "@/components/routine/RoutineDetailSheet";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import {
  CustomExerciseSheet,
  ExerciseActionSheet,
  ExerciseDetailSheet,
  ExerciseEditor,
  ExerciseRecordCard,
  ExerciseRecordList,
  ExerciseSelection,
  cloneExerciseRecords,
  createExerciseRecord,
  ROUTINE_LIMIT,
} from "@/components/exercise";
import {
  exercisePreviewDefinitions,
  exercisePreviewRecords,
} from "@/constants/exercisePreviewData";

function Section({ title, children, fullWidth = false }) {
  return (
    <View className="gap-3">
      <Text className="px-4 text-18 font-pretendard-bold text-text">
        {title}
      </Text>
      <View
        className={`gap-4 bg-grayscale-G50 py-4 ${fullWidth ? "" : "px-4"}`}
      >
        {children}
      </View>
    </View>
  );
}

export default function ExerciseComponentsPreview({ onNotify = () => {} }) {
  const [records, setRecords] = useState(() =>
    cloneExerciseRecords(exercisePreviewRecords)
  );
  const [definitions, setDefinitions] = useState(exercisePreviewDefinitions);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [memberConfirmed, setMemberConfirmed] = useState(false);
  const [allowPTEdit, setAllowPTEdit] = useState(false);
  const [routines, setRoutines] = useState(() => [
    {
      id: "routine-trainer",
      name: "트레이너 지정 하체",
      trainerAssigned: true,
      records: cloneExerciseRecords(exercisePreviewRecords),
    },
    {
      id: "routine-personal",
      name: "내 운동 루틴",
      trainerAssigned: false,
      records: cloneExerciseRecords(exercisePreviewRecords),
    },
  ]);
  const activeRoutine = routines.find((routine) => routine.id === sheet?.id);
  const activeExercise = definitions.find(
    (exercise) => exercise.id === sheet?.id
  );
  const close = () => setSheet(null);
  const notify = (message) => onNotify(message);
  const removeRoutine = (routine) => {
    setRoutines((items) => items.filter((item) => item.id !== routine.id));
    close();
    notify("루틴 삭제 완료");
  };
  const addRoutine = () => {
    if (routines.length >= ROUTINE_LIMIT || !records.length) return;
    setRoutines((items) =>
      items.length >= ROUTINE_LIMIT
        ? items
        : [
            ...items,
            {
              id: `routine-${Date.now()}-${items.length}`,
              name: `새 루틴 ${items.length + 1}`,
              trainerAssigned: false,
              records: cloneExerciseRecords(records),
            },
          ]
    );
  };
  return (
    <View
      className="w-full max-w-[390px] gap-7 self-center"
      testID="exercise-components-preview"
    >
      <Text className="px-4 text-24 font-pretendard-bold text-text">
        운동·루틴 컴포넌트 10종
      </Text>
      <Section title="ExerciseRecordCard · 운동 / PT">
        <ExerciseRecordCard
          title="내일 계단 안 오를거라 다짐하고 하체 조짐"
          time="12:00-14:00"
          exerciseCount={records.length}
          onPress={() => setSheet({ type: "journal" })}
        />
        <ExerciseRecordCard
          type="pt"
          title="홍길동 트레이너님"
          time="15:00-16:00"
          location="다짐 헬스장"
          sessionLabel="4 / 10회차"
          exerciseCount={records.length}
          showConfirmation
          memberConfirmed={memberConfirmed}
          trainerConfirmed
          onPress={() => setSheet({ type: "pt" })}
          onConfirm={() =>
            setDialog({
              title: "4회차 PT 진행 완료",
              content: "홍길동 트레이너와 4번째 PT를 완료하셨나요?",
              confirmText: "네",
              action: () => {
                setMemberConfirmed(true);
                notify("PT 확인 완료");
              },
            })
          }
        />
        <Button
          text={allowPTEdit ? "PT 수정 권한: 허용" : "PT 수정 권한: 읽기 전용"}
          onPress={() => setAllowPTEdit(!allowPTEdit)}
          accessibilityRole="button"
        />
      </Section>
      <Section title="ExerciseRecordList · 읽기 전용">
        <View className="bg-white p-3">
          <ExerciseRecordList records={records} />
        </View>
      </Section>
      <Section title="ExerciseEditor · 입력 / 세트 / 운동 삭제">
        <ExerciseEditor
          records={records}
          onChange={setRecords}
          onAddExercise={() => {
            notify("아래 운동 선택에서 추가할 수 있어요.");
          }}
        />
        <Button
          text="편집 예제 초기화"
          variant="weakDark"
          onPress={() =>
            setRecords(cloneExerciseRecords(exercisePreviewRecords))
          }
          accessibilityRole="button"
        />
      </Section>
      <Section title="ExerciseSelection · 검색 / 다중 선택" fullWidth>
        <View style={{ height: 620 }}>
          <ExerciseSelection
            exercises={definitions}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onCreateExercise={() => setSheet({ type: "custom" })}
            onManageExercise={(exercise) =>
              setSheet({ type: "exercise-actions", id: exercise.id })
            }
            onConfirm={(selected) => {
              setRecords((items) => [
                ...items,
                ...selected.map(createExerciseRecord),
              ]);
              setSelectedIds([]);
              notify(`운동 ${selected.length}개 추가 완료`);
            }}
          />
        </View>
      </Section>
      <Section title="CustomExerciseSheet / ExerciseActionSheet">
        <Button
          text="신규 운동 등록 열기"
          variant="fill"
          onPress={() => setSheet({ type: "custom" })}
          accessibilityRole="button"
        />
        <Button
          text="MY 운동 관리 열기"
          disabled={!definitions.some((item) => item.isCustom)}
          onPress={() =>
            setSheet({
              type: "exercise-actions",
              id: definitions.find((item) => item.isCustom)?.id,
            })
          }
          accessibilityRole="button"
        />
      </Section>
      <Section title="RoutineDetailSheet / RoutineActionSheet">
        <Text className="text-14 text-grayscale-G600">
          루틴 {routines.length}/{ROUTINE_LIMIT}개 · 지정 루틴 포함
        </Text>
        {routines.map((routine) => (
          <Routine
            key={routine.id}
            routineName={routine.name}
            trainer={routine.trainerAssigned}
            exerciseCount={routine.records.length}
            onPress={() => setSheet({ type: "routine-detail", id: routine.id })}
            onPressMore={() =>
              setSheet({ type: "routine-actions", id: routine.id })
            }
          />
        ))}
        <Button
          text={`루틴 추가 (${routines.length}/${ROUTINE_LIMIT})`}
          variant="fill"
          disabled={routines.length >= ROUTINE_LIMIT || !records.length}
          onPress={addRoutine}
          accessibilityRole="button"
        />
      </Section>
      <Section title="ConfirmDialog · 작성 중 이탈">
        <Button
          text="작성 중 이탈 확인 열기"
          onPress={() =>
            setDialog({
              title: "작성을 중단할까요?",
              content: "저장하지 않은 내용은 사라집니다.",
              confirmText: "나가기",
              action: () => notify("이탈 확인 콜백 실행"),
            })
          }
          accessibilityRole="button"
        />
      </Section>
      <ExerciseDetailSheet
        visible={sheet?.type === "journal" || sheet?.type === "pt"}
        onClose={close}
        type={sheet?.type === "pt" ? "pt" : "exercise"}
        title={sheet?.type === "pt" ? "홍길동 트레이너님" : "내 운동일지"}
        dateLabel="2026년 4월 2일 (목) 12:00-14:00"
        sessionLabel="4 / 10회차"
        records={records}
        memo="운동 후 컨디션과 기록을 확인해보세요."
        canEdit={sheet?.type !== "pt" || allowPTEdit}
        canDelete
        onEdit={() => {
          close();
          notify("기존 초안으로 운동 편집 연결");
        }}
        onDelete={() =>
          setDialog({
            title: "운동일지 삭제",
            content: "이 운동일지를 삭제할까요?",
            confirmText: "삭제하기",
            action: () => {
              close();
              notify("일지 삭제 콜백 실행");
            },
          })
        }
      />
      <CustomExerciseSheet
        visible={sheet?.type === "custom"}
        onClose={close}
        initialValue={activeExercise}
        onSubmit={(exercise) => {
          const value = {
            ...exercise,
            id: exercise.id ?? `custom-${Date.now()}`,
          };
          setDefinitions((items) =>
            exercise.id
              ? items.map((item) => (item.id === exercise.id ? value : item))
              : [...items, value]
          );
          close();
          notify(exercise.id ? "운동 수정 완료" : "운동 신규 등록 완료");
        }}
      />
      <ExerciseActionSheet
        visible={sheet?.type === "exercise-actions"}
        exercise={activeExercise}
        onClose={close}
        onEdit={(exercise) => setSheet({ type: "custom", id: exercise.id })}
        onDelete={(exercise) => {
          setDefinitions((items) =>
            items.filter((item) => item.id !== exercise.id)
          );
          setSelectedIds((ids) => ids.filter((id) => id !== exercise.id));
          close();
          notify("MY 운동 삭제 완료 · 기존 일지 기록 유지");
        }}
      />
      <RoutineDetailSheet
        visible={sheet?.type === "routine-detail"}
        routine={activeRoutine}
        onClose={close}
        onRecord={(routine) => {
          setRecords(cloneExerciseRecords(routine.records));
          close();
          notify("루틴을 일지 초안으로 복사 · 원본 유지");
        }}
      />
      <RoutineActionSheet
        visible={sheet?.type === "routine-actions"}
        routine={activeRoutine}
        onClose={close}
        onEdit={(routine) => {
          setRecords(cloneExerciseRecords(routine.records));
          close();
          notify("개인 루틴 수정 콜백 실행");
        }}
        onDelete={removeRoutine}
      />
      <ConfirmDialog
        visible={!!dialog}
        title={dialog?.title}
        content={dialog?.content}
        confirmText={dialog?.confirmText}
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          dialog?.action();
          setDialog(null);
        }}
      />
    </View>
  );
}
