import { useRouter } from "expo-router";
import NotificationSettings from "@/features/trainer-settings/NotificationSettings";
import { useTrainerSettings } from "@/features/trainer-settings/TrainerSettingsProvider";

export default function TrainerNotificationSettingsScreen() {
  const router = useRouter();
  const { notifications, changeNotification } = useTrainerSettings();
  return <NotificationSettings value={notifications} onChange={changeNotification} showAppOptions onBack={() => router.dismissTo("/(trainerTabs)/mypage")} />;
}
