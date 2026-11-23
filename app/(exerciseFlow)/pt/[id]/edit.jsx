import { useLocalSearchParams } from "expo-router";
import DraftFormScreen from "@/features/exercise/DraftFormScreen";
import { firstParam } from "@/features/exercise/navigation";

export default function EditPT() {
  const { id } = useLocalSearchParams();
  return <DraftFormScreen kind="pt" sourceId={firstParam(id)} />;
}
