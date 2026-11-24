import NotificationSettings from "@/components/settings/NotificationSettings";
import { useMemberSettings } from "@/features/user-settings/MemberSettingsProvider";
import { useSettingsNavigation } from "@/features/user-settings/Frame";
export default function MemberNotificationsScreen() {
  const { state, send } = useMemberSettings(); const nav = useSettingsNavigation();
  return <NotificationSettings value={state.notifications} onChange={(key, value) => send({ type: "notification", key, value })} onBack={nav.goBack} />;
}
