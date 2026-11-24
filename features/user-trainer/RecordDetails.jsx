import { userTrainerLesson } from "@/constants/userTrainer";
import { useRouter } from "expo-router";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Text } from "react-native";
import { useExercise } from "@/features/exercise/ExerciseProvider";
import { useMealRecords } from "@/components/meal-record/MealRecordsContext";
import MealRecordDetailSheet from "@/components/meal-record/MealRecordDetailSheet";
import ExerciseDetailSheet from "@/components/exercise/ExerciseDetailSheet";
import Sheet from "@/components/exercise/Sheet";
import Button from "@/components/button";

export default function RecordDetails({ detail, onClose }) {
  const router = useRouter();
  const { state } = useExercise();
  const { records, deleteRecord } = useMealRecords();
  if (!detail) return null;
  const meal = detail.kind === "meal" ? records.find((item) => item.id === detail.id) : null;
  const session = detail.kind === "pt" ? (detail.id === userTrainerLesson.id ? userTrainerLesson : state.sessions.find((item) => item.id === detail.id)) : null;
  if (meal) return <MealRecordDetailSheet record={meal} onClose={onClose} onDelete={deleteRecord}
    onEdit={() => { onClose(); router.push({ pathname: "/(userTabs)/meal-record", params: { recordId: meal.id, date: meal.date } }); }} />;
  if (session) return <ExerciseDetailSheet visible type="pt" title={session.trainerName}
    sessionLabel={`${session.sessionNumber} / ${session.totalSessions}회차`} records={session.records} memo={session.memo}
    dateLabel={`${format(parseISO(session.date), "yyyy년 M월 d일 (EEE)", { locale: ko })} ${session.startTime}-${session.endTime}`} onClose={onClose} />;
  return <Sheet visible onClose={onClose} initialHeight={230} header={<Text className="text-18 font-pretendard-bold text-text">기록을 찾을 수 없어요.</Text>}
    footer={<Button accessibilityRole="button" text="확인" onPress={onClose} />}><Text className="text-14 text-grayscale-G600">삭제되었거나 아직 불러오지 못한 기록이에요.</Text></Sheet>;
}
