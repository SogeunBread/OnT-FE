import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrainerList from "@/components/trainer_list";
import Heart from "@/components/heart";
import PreparationNotice from "@/components/settings/PreparationNotice";
import { useDiscovery } from "@/features/user-home/DiscoveryProvider";
import { homeRoutes, trainerRoute } from "@/features/user-home/navigation";
import Frame, { Empty, useSettingsNavigation } from "./Frame";
export default function WishlistScreen() {
  const { state, send, trainers, addCompare, notice, setNotice } = useDiscovery(); const nav = useSettingsNavigation(); const insets = useSafeAreaInsets();
  const rows = trainers.filter(item => state.liked.includes(item.id));
  return <Frame title="찜 리스트" actionType="compare" compareLabel="비교함" onPressCompare={() => nav.push(homeRoutes.compare)}>{rows.length ? <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 34) }}>{rows.map(trainer => <View key={trainer.id}>
    <View className="items-end px-4 pt-3"><Heart liked onChange={() => send({ type: "like", id: trainer.id })} /></View>
    <TrainerList name={trainer.name} gym={trainer.location?.name} demographics={`${trainer.gender}・${trainer.age}세`} rating={Number(trainer.rating).toFixed(1)} verified={trainer.verified} reviewCount={trainer.reviewCount} lessonCount={state.filters.count} price={Number(trainer.prices.find(item => item.count === state.filters.count)?.price ?? 0).toLocaleString("ko-KR")} tags={trainer.specialties} avatarSource={trainer.avatarSource} onPress={() => nav.push(trainerRoute(trainer.id))} onPressCompare={() => addCompare(trainer.id)} />
  </View>)}</ScrollView> : <Empty text="찜한 트레이너가 없어요." />}<PreparationNotice title={notice} onClose={() => setNotice("")} /></Frame>;
}
