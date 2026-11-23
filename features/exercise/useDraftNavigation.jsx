import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { useExercise } from "./ExerciseProvider";

export default function useDraftNavigation(draft) {
  const navigation = useNavigation();
  const { send } = useExercise();
  const bypass = useRef(false);
  const [pendingAction, setPendingAction] = useState(null);
  usePreventRemove(!!draft?.dirty, ({ data }) => {
    if (bypass.current) {
      navigation.dispatch(data.action);
      return;
    }
    setPendingAction(data.action);
  });
  useEffect(
    () =>
      navigation.addListener("beforeRemove", () => {
        if (draft && !draft.dirty) send({ type: "DROP_DRAFT", id: draft.id });
      }),
    [navigation, draft?.id, draft?.dirty, send]
  );
  useEffect(() => {
    if (Platform.OS !== "web" || !draft?.dirty) return;
    const handler = (event) => {
      if (!bypass.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [draft?.dirty]);
  const dialog = (
    <ConfirmDialog
      visible={!!pendingAction}
      title="작성을 중단할까요?"
      content="저장하지 않은 내용은 사라집니다."
      confirmText="나가기"
      onCancel={() => setPendingAction(null)}
      onConfirm={() => {
        const action = pendingAction;
        bypass.current = true;
        send({ type: "DROP_DRAFT", id: draft.id });
        setPendingAction(null);
        navigation.dispatch(action);
      }}
    />
  );
  return {
    dialog,
    allowNavigation: () => {
      bypass.current = true;
    },
  };
}
