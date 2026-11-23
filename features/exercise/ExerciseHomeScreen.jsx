import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Calendar from "@/components/calendar";
import ButtonSmall from "@/components/button/ButtonSmall";
import ExerciseRecordCard from "@/components/exercise/ExerciseRecordCard";
import ExerciseDetailSheet from "@/components/exercise/ExerciseDetailSheet";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { useExercise } from "./ExerciseProvider";
import { canEditPTRecord } from "./state";
import { exerciseRoutes, firstParam } from "./navigation";

const sessionLabel = (session) =>
  `${session.sessionNumber} / ${session.totalSessions}회차`;
export default function ExerciseHomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { state, send } = useExercise();
  const [detail, setDetail] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const reopenedId = firstParam(params.recordId);
  const reopenedType = firstParam(params.recordType);
  useEffect(() => {
    if (!state.ready || !reopenedId) return;
    const type = reopenedType === "pt" ? "pt" : "exercise";
    if (
      (type === "pt" ? state.sessions : state.journals).some(
        (item) => item.id === reopenedId
      )
    )
      setDetail({ type, id: reopenedId });
    router.setParams({ recordId: undefined, recordType: undefined });
  }, [
    state.ready,
    reopenedId,
    reopenedType,
    state.sessions,
    state.journals,
    router,
  ]);
  const selected = state.selectedDate;
  const journals = state.journals
    .filter((item) => item.date === selected)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const sessions = state.sessions
    .filter((item) => item.date === selected)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const record = (detail?.type === "pt" ? state.sessions : state.journals).find(
    (item) => item.id === detail?.id
  );
  const confirming = state.sessions.find((item) => item.id === confirmId);
  const events = [
    ...state.journals.map((item) => ({ date: item.date, type: "exercise" })),
    ...state.sessions.map((item) => ({ date: item.date, type: "pt" })),
  ];
  const edit = () => {
    const target = detail;
    setDetail(null);
    router.push({
      pathname:
        target.type === "pt"
          ? "/(exerciseFlow)/pt/[id]/edit"
          : "/(exerciseFlow)/journal/[id]/edit",
      params: { id: target.id },
    });
  };
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      {state.ready && (
        <Calendar
          compact
          compactLayout="exercise"
          mode="week"
          selectedDate={new Date(`${selected}T12:00:00`)}
          events={events}
          eventDotClasses={{
            exercise: "bg-primary-main",
            pt: "bg-secondary-blue",
          }}
          onDateSelect={(date) =>
            send({ type: "SELECT_DATE", date: format(date, "yyyy-MM-dd") })
          }
        />
      )}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 12, gap: 16 }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-16 font-pretendard-semibold text-text">
            {selected
              ? format(new Date(`${selected}T12:00:00`), "yyyy년 M월 d일")
              : "운동"}
          </Text>
          <ButtonSmall
            text="기록 추가"
            accessibilityRole="button"
            disabled={!state.ready}
            onPress={() =>
              router.push({
                pathname: exerciseRoutes.journalNew,
                params: { date: selected },
              })
            }
          />
        </View>
        {!state.ready ? (
          <Text className="py-5 text-center text-12 text-grayscale-G500">
            불러오는 중입니다.
          </Text>
        ) : (
          <>
            {journals.map((item) => (
              <ExerciseRecordCard
                key={item.id}
                title={item.title}
                time={`${item.startTime}-${item.endTime}`}
                exerciseCount={item.records.length}
                onPress={() => setDetail({ type: "exercise", id: item.id })}
              />
            ))}
            {sessions.map((item) => (
              <ExerciseRecordCard
                key={item.id}
                type="pt"
                title={item.trainerName}
                time={`${item.startTime}-${item.endTime}`}
                location={item.location}
                exerciseCount={item.records.length}
                sessionLabel={sessionLabel(item)}
                memberConfirmed={item.memberConfirmed}
                trainerConfirmed={item.trainerConfirmed}
                showConfirmation={
                  new Date(`${item.date}T${item.endTime}:00`).getTime() <= now
                }
                onPress={() => setDetail({ type: "pt", id: item.id })}
                onConfirm={() => setConfirmId(item.id)}
              />
            ))}
            {!journals.length && !sessions.length && (
              <Text className="py-5 text-center text-12 font-pretendard-regular text-grayscale-G400">
                등록된 운동 일지가 없어요.
              </Text>
            )}
          </>
        )}
      </ScrollView>
      <ExerciseDetailSheet
        visible={!!record}
        type={detail?.type}
        title={detail?.type === "pt" ? record?.trainerName : record?.title}
        dateLabel={
          record
            ? `${format(
                new Date(`${record.date}T12:00:00`),
                "yyyy년 M월 d일 (EEE)",
                { locale: ko }
              )} ${record.startTime}-${record.endTime}`
            : ""
        }
        sessionLabel={
          record && detail?.type === "pt" ? sessionLabel(record) : undefined
        }
        records={record?.records}
        memo={record?.memo}
        canEdit={detail?.type === "pt" ? canEditPTRecord(record) : true}
        canDelete={detail?.type !== "pt"}
        onEdit={edit}
        onDelete={() => setDeleteId(record.id)}
        onClose={() => {
          setDetail(null);
          setDeleteId(null);
        }}
      >
        <ConfirmDialog
          visible={!!deleteId}
          title="운동일지를 삭제할까요?"
          content="삭제한 기록은 되돌릴 수 없습니다."
          confirmText="삭제하기"
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            send({ type: "DELETE_JOURNAL", id: deleteId });
            setDeleteId(null);
            setDetail(null);
          }}
        />
      </ExerciseDetailSheet>
      <ConfirmDialog
        visible={!!confirming}
        title={
          confirming
            ? `${confirming.sessionNumber}회차 PT 진행 완료`
            : "PT 진행 완료"
        }
        content={
          confirming
            ? `${confirming.trainerName}과 ${confirming.sessionNumber}번째 PT를 완료하셨나요?`
            : ""
        }
        confirmText="네"
        cancelVariant="weakDark"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          send({ type: "CONFIRM_PT", id: confirmId, now: Date.now() });
          setConfirmId(null);
        }}
      />
    </SafeAreaView>
  );
}
