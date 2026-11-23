import { useLocalSearchParams } from "expo-router";
import DraftFormScreen from "@/features/exercise/DraftFormScreen";
import { firstParam } from "@/features/exercise/navigation";

export default function EditJournal() {
  const { id } = useLocalSearchParams();
  return <DraftFormScreen kind="journal" sourceId={firstParam(id)} />;
}
