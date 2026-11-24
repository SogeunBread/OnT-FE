import { useEffect, useState } from "react";
import { ScrollView, AppState } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PreparationNotice from "@/components/settings/PreparationNotice";
import { useDiscovery } from "@/features/user-home/DiscoveryProvider";
import { trainerRoute } from "@/features/user-home/navigation";
import { useUserTrainer } from "@/features/user-trainer/UserTrainerProvider";
import { requestEditable } from "@/features/user-trainer/state";
import { useMemberSettings } from "./MemberSettingsProvider";
import Frame, { Empty, useSettingsNavigation } from "./Frame";
import { requestHistoryRows, reviewAvailability } from "./state";
import { reviewRoute } from "./navigation";
import RequestHistoryRow from "./RequestHistoryRow";
export default function RequestHistoryScreen({ rowsOverride }) {
  const { state, policy } = useMemberSettings(); const { state: requests } = useUserTrainer(); const { trainers } = useDiscovery(); const nav = useSettingsNavigation(); const insets = useSafeAreaInsets();
  const [now, setNow] = useState(Date.now); const [notice, setNotice] = useState("");
  useEffect(() => { const update = () => setNow(Date.now()); const timer = setInterval(update, 60000); const sub = AppState.addEventListener("change", update); return () => { clearInterval(timer); sub.remove(); }; }, []);
  const rows = rowsOverride ?? [state.histories[0], ...requestHistoryRows(requests.rooms, trainers), ...state.histories.slice(1)].filter(Boolean);
  return <Frame title="수업 요청 이력">{rows.length ? <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 34) }}>{rows.map(item => {
    const room = requests.rooms.find(room => room.id === item.roomId); const request = room?.requests.find(request => request.id === item.requestId);
    return <RequestHistoryRow key={item.id} item={item} reviewWritten={state.reviews.some(review => review.historyId === item.id)} reviewDisabled={!!reviewAvailability(item, state.reviews, now, policy)} onProfile={() => item.trainerId && trainers.some(trainer => trainer.id === item.trainerId) ? nav.push(trainerRoute(item.trainerId)) : setNotice("트레이너 프로필")}
      onReview={() => nav.push(reviewRoute(item.id))} onEdit={requestEditable(room, request) ? () => nav.push({ pathname: "/(userTrainerFlow)/request-edit", params: { roomId: item.roomId, requestId: item.requestId, origin: "settings" } }) : undefined} />;
  })}</ScrollView> : <Empty text="수업 요청 이력이 없어요." />}<PreparationNotice title={notice} onClose={() => setNotice("")} /></Frame>;
}
