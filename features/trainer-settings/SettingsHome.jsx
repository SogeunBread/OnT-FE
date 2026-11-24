import AccountIdentity from "@/components/settings/AccountIdentity";
import List from "@/components/list";
import { ScrollView } from "react-native";

export default function SettingsHome({ account, onProfile, onNotifications, onPastPt, onInquiry, onTerms }) {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 16 }}>
      <AccountIdentity account={account} onPress={onProfile} />
      <List title="알림 설정" subtitle="" onPress={onNotifications} />
      <List title="지난 PT 기록" subtitle="" onPress={onPastPt} />
      <List title="1:1 고객 문의" subtitle="" onPress={onInquiry} />
      <List title="약관 및 정책" subtitle="" onPress={onTerms} />
    </ScrollView>
  );
}
