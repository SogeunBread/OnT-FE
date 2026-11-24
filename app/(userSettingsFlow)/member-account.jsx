import AccountSettingsScreen from "@/components/settings/AccountSettingsScreen";
import { useMemberSettings } from "@/features/user-settings/MemberSettingsProvider";
import { settingsRoutes } from "@/features/user-settings/navigation";
export default function MemberAccountScreen() {
  const { state, saveAccount } = useMemberSettings();
  return <AccountSettingsScreen account={state.account} saveAccount={saveAccount} returnRoute={settingsRoutes.home} />;
}
