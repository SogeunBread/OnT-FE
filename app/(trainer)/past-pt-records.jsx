import { useRouter } from "expo-router";
import { View } from "react-native";
import NavigationBar from "@/components/navigation/NavigationBar";
import { trainerTabs } from "@/constants/trainerTabs";
import { trainerPastPtRecords } from "@/constants/trainerSettings";
import PastPtRecords from "@/features/trainer-settings/PastPtRecords";

export default function TrainerPastPtRecordsScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <PastPtRecords records={trainerPastPtRecords} onBack={() => router.dismissTo("/(trainerTabs)/mypage")} />
      <NavigationBar tabs={trainerTabs} state={{ routes: trainerTabs.map((tab) => ({ key: tab.name, name: tab.name })), index: 1 }} navigation={{ emit: () => ({ defaultPrevented: false }), navigate: (name) => router.replace(`/(trainerTabs)/${name}`) }} labelClassName="mt-2" />
    </View>
  );
}
