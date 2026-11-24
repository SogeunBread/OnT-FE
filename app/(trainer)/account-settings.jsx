import AccountSettingsScreen from "@/components/settings/AccountSettingsScreen";
import { useTrainerSettings } from "@/features/trainer-settings/TrainerSettingsProvider";
export default function TrainerAccountSettingsScreen() {
  const { account, saveAccount } = useTrainerSettings();
  return <AccountSettingsScreen account={account} saveAccount={saveAccount} returnRoute="/(trainerTabs)/mypage" />;
}
