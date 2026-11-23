import { useLocalSearchParams } from "expo-router";
import DraftFormScreen from "@/features/exercise/DraftFormScreen";
import { firstParam } from "@/features/exercise/navigation";

export default function EditRoutine() {
  const { id } = useLocalSearchParams();
  return <DraftFormScreen kind="routine" sourceId={firstParam(id)} />;
}
