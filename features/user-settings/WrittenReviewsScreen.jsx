import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Star from "@/components/star";
import Right from "@/assets/figma/settings-account-right.svg";
import More from "@/assets/figma/settings/review-more.svg";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import PreparationNotice from "@/components/settings/PreparationNotice";
import { trainerRoute } from "@/features/user-home/navigation";
import { useDiscovery } from "@/features/user-home/DiscoveryProvider";
import { useMemberSettings } from "./MemberSettingsProvider";
import Frame, { Empty, useSettingsNavigation } from "./Frame";
import { reviewRoute } from "./navigation";
const dateLabel = value => { const date = new Date(value); return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`; };
export default function WrittenReviewsScreen() {
  const { state, policy, send } = useMemberSettings(); const { trainers } = useDiscovery(); const nav = useSettingsNavigation(); const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null); const [deleting, setDeleting] = useState(null); const [notice, setNotice] = useState("");
  return <Frame title="작성한 리뷰">{state.reviews.length ? <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 34) }}>{state.reviews.map(review => {
    const history = state.histories.find(item => item.id === review.historyId); const trainer = history?.trainer ?? trainers.find(item => item.id === review.trainerId);
    return <View key={review.id} className="gap-2 border-b border-grayscale-G50 px-4 py-3"><View className="flex-row items-start justify-between gap-3"><View className="min-w-0 flex-1 gap-0.5">
      <Pressable accessibilityRole="button" accessibilityLabel={`${trainer?.name ?? "트레이너"} 프로필`} onPress={() => trainers.some(item => item.id === review.trainerId) ? nav.push(trainerRoute(review.trainerId)) : setNotice("트레이너 프로필")} className="flex-row items-center gap-1"><Text className="shrink text-14 font-pretendard-semibold text-text">{trainer?.name ?? "트레이너"}</Text><Right /></Pressable>
      <View className="flex-row flex-wrap items-center gap-2"><View className="flex-row gap-px" accessibilityLabel={`별점 ${review.rating}점`}>{[1, 2, 3, 4, 5].map(value => <Star key={value} active={value <= review.rating} />)}</View><Text className="text-12 font-pretendard-medium text-grayscale-G400">{dateLabel(review.createdAt)}</Text></View>
    </View>{(policy.allowEdit || policy.allowDelete) && <Pressable accessibilityRole="button" accessibilityLabel={`${trainer?.name ?? "트레이너"} 리뷰 더보기`} hitSlop={8} onPress={() => setSelected(review)}><More /></Pressable>}</View>
      {!!review.text && <Text className="text-12 font-pretendard-regular text-grayscale-G700">{review.text}</Text>}
    </View>;
  })}</ScrollView> : <Empty text="작성한 리뷰가 없어요." />}
    <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}><View className="flex-1 justify-end"><Pressable accessibilityRole="button" accessibilityLabel="리뷰 메뉴 닫기" onPress={() => setSelected(null)} className="absolute inset-0 bg-text/20" /><View accessibilityViewIsModal className="rounded-t-2xl bg-white px-4 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      {policy.allowEdit && <Pressable accessibilityRole="button" accessibilityLabel="리뷰 수정" className="min-h-[48px] justify-center" onPress={() => { const review = selected; setSelected(null); if (review) nav.push(reviewRoute(review.historyId, review.id)); }}><Text className="text-16 text-text">수정</Text></Pressable>}
      {policy.allowDelete && <Pressable accessibilityRole="button" accessibilityLabel="리뷰 삭제" className="min-h-[48px] justify-center" onPress={() => { setDeleting(selected?.id); setSelected(null); }}><Text className="text-16 text-primary-main">삭제</Text></Pressable>}
      <Pressable accessibilityRole="button" className="min-h-[48px] justify-center" onPress={() => setSelected(null)}><Text className="text-16 text-grayscale-G600">취소</Text></Pressable>
    </View></View></Modal>
    <ConfirmDialog visible={!!deleting} title="리뷰를 삭제할까요?" content="삭제한 리뷰는 복구할 수 없어요." confirmText="삭제" cancelText="취소" onCancel={() => setDeleting(null)} onConfirm={() => { send({ type: "delete-review", id: deleting, policy }); setDeleting(null); }} />
    <PreparationNotice title={notice} onClose={() => setNotice("")} />
  </Frame>;
}
