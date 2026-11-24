import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/button";
import RequestDetails from "@/components/pt-request/RequestDetails";
import RequestSheetLayout from "@/components/pt-request/RequestSheetLayout";
import ConfirmDialog from "@/components/modal/ConfirmDialog";

export default function UserRequestSheet({ request, editable, onClose, onEdit, onCancel, initialConfirm = false }) {
  const [confirm, setConfirm] = useState(initialConfirm);
  const [busy, setBusy] = useState(false);
  return <RequestSheetLayout label="PT 수업 요청서" onClose={onClose} onBack={confirm ? () => setConfirm(false) : onClose}
    footer={editable && <View className="flex-row gap-4">
      <Button accessibilityRole="button" text="요청 취소" variant="weakDark" className="flex-[1]" onPress={() => setConfirm(true)} disabled={busy} />
      <Button accessibilityRole="button" text="요청서 수정" variant="weak" className="flex-[2]" onPress={onEdit} disabled={busy} />
    </View>}>
    <View className="gap-5 pb-1">
      <View className="border-b border-grayscale-G50 py-2"><Text className="text-18 font-pretendard-bold text-text">PT 수업 요청서</Text></View>
      <RequestDetails request={request} />
    </View>
    <ConfirmDialog visible={confirm} title="매칭 요청을 취소할까요?" content="취소하면 해당 트레이너와의 매칭 요청이 종료됩니다."
      confirmText="요청 취소" onCancel={() => setConfirm(false)} busy={busy}
      onConfirm={() => { if (busy) return; setBusy(true); onCancel(); }} />
  </RequestSheetLayout>;
}
