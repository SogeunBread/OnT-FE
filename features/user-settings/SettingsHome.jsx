import { useState } from "react";
import { ScrollView, View } from "react-native";
import List from "@/components/list";
import AccountIdentity from "@/components/settings/AccountIdentity";
import { PTCountSummary } from "@/components/pt-request/PTProgressSummary";
import PreparationNotice from "@/components/settings/PreparationNotice";
import { useMemberSettings } from "./MemberSettingsProvider";
import { settingsRoutes } from "./navigation";
import { useSettingsNavigation } from "./Frame";
export default function SettingsHome() {
  const { state } = useMemberSettings(); const nav = useSettingsNavigation(); const [notice, setNotice] = useState("");
  const menus = [["알림 설정", settingsRoutes.notifications], ["찜 리스트", settingsRoutes.wishlist], ["작성한 리뷰", settingsRoutes.reviews], ["매칭 요청 관리", settingsRoutes.history], ["이용 안내 및 튜토리얼"], ["1:1 고객 문의"], ["약관 및 정책"]];
  return <><ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 16 }}>
    <AccountIdentity account={state.account} onPress={() => nav.push(settingsRoutes.account)} />
    <View className="px-4 pb-4"><PTCountSummary summary={state.summary} valueClassName="text-primary-main" /></View>
    {menus.map(([title, route]) => <List key={title} title={title} subtitle="" onPress={() => route ? nav.push(route) : setNotice(title)} />)}
  </ScrollView><PreparationNotice title={notice} onClose={() => setNotice("")} /></>;
}
