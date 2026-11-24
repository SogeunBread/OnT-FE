import { useState } from "react";
import { useRouter } from "expo-router";
import SettingsHome from "@/features/trainer-settings/SettingsHome";
import PreparationNotice from "@/features/trainer-settings/PreparationNotice";
import { useTrainerSettings } from "@/features/trainer-settings/TrainerSettingsProvider";

export default function TrainerMypageTab() {
  const router = useRouter();
  const { account } = useTrainerSettings();
  const [notice, setNotice] = useState("");
  return (
    <>
      <SettingsHome account={account} onProfile={() => router.push("/(trainer)/account-settings")} onNotifications={() => router.push("/(trainer)/notification-settings")} onPastPt={() => router.push("/(trainer)/past-pt-records")} onInquiry={() => setNotice("1:1 고객 문의")} onTerms={() => setNotice("약관 및 정책")} />
      <PreparationNotice title={notice} onClose={() => setNotice("")} />
    </>
  );
}

