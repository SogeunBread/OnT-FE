import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import { trainerTabs } from "@/constants/trainerTabs";
import { trainerNotificationDefaults, trainerPastPtRecords, trainerSettingsAccount } from "@/constants/trainerSettings";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import AccountProfileForm from "./AccountProfileForm";
import NotificationSettings from "./NotificationSettings";
import PastPtRecords from "./PastPtRecords";
import SettingsHome from "./SettingsHome";

const SCENARIOS = [
  ["2134:22198", "내 정보", "home"],
  ["2140:20619", "프로필 설정", "profile"],
  ["2134:22314", "앱 설정 · 푸시 꺼짐", "app-off"],
  ["2134:22337", "앱 설정 · 푸시 켜짐", "app-on"],
  ["2134:22326", "알림 설정 · 푸시 꺼짐", "notifications-off"],
  ["2134:22349", "알림 설정 · 푸시 켜짐", "notifications-on"],
  ["2140:20690", "지난 PT 기록", "history"],
];

function PreviewFlow({ scenario, onClose }) {
  const [screen, setScreen] = useState(scenario);
  const [account, setAccount] = useState({ ...trainerSettingsAccount });
  const [notifications, setNotifications] = useState({ ...trainerNotificationDefaults, push: scenario.endsWith("-on") });
  const [message, setMessage] = useState("");
  const back = () => screen === scenario ? onClose() : setScreen("home");
  const showTabs = screen === "home" || screen === "history";
  return (
    <View className="flex-1 bg-white">
      {screen === "home" ? (
        <>
          <HeaderMain menuName="내 정보" onPressBell={() => setScreen("notifications-off")} />
          <SettingsHome account={account} onProfile={() => setScreen("profile")} onNotifications={() => setScreen("notifications-off")} onPastPt={() => setScreen("history")} onInquiry={() => setMessage("1:1 고객 문의 준비 중")} onTerms={() => setMessage("약관 및 정책 준비 중")} />
        </>
      ) : screen === "profile" ? (
        <AccountProfileForm value={account} onChange={(key, next) => setAccount((current) => ({ ...current, [key]: next }))} onBack={back} onPickPhoto={() => setMessage("실제 화면에서 사진을 선택할 수 있어요.")} onLogout={() => setMessage("로그아웃 준비 중")} onWithdraw={() => setMessage("회원탈퇴 준비 중")} />
      ) : screen === "history" ? (
        <PastPtRecords records={trainerPastPtRecords} onBack={back} />
      ) : (
        <NotificationSettings value={notifications} onChange={(key, next) => setNotifications((current) => ({ ...current, [key]: next }))} onBack={back} showAppOptions={screen.startsWith("app-")} />
      )}
      {message ? <Pressable accessibilityRole="button" accessibilityLabel="안내 닫기" onPress={() => setMessage("")} className="bg-primary-50 px-4 py-3"><Text className="text-12 font-pretendard-regular text-text">{message}</Text></Pressable> : null}
      {showTabs ? <NavigationBar tabs={trainerTabs} state={{ routes: trainerTabs.map((tab) => ({ key: tab.name, name: tab.name })), index: screen === "history" ? 1 : 4 }} navigation={{ emit: () => ({ defaultPrevented: false }), navigate: (name) => name === "mypage" ? setScreen("home") : onClose() }} labelClassName="mt-2" /> : null}
    </View>
  );
}

export default function TrainerSettingsPreview() {
  const [scenario, setScenario] = useState(null);
  return (
    <View className="gap-2">
      {SCENARIOS.map(([id, label, key]) => (
        <Pressable key={id} accessibilityRole="button" onPress={() => setScenario(key)} className="rounded-lg border border-grayscale-G100 bg-white px-3 py-2">
          <Text className="text-14 font-pretendard-semibold text-text">{label}</Text>
          <Text className="text-12 font-pretendard-regular text-grayscale-G500">{id}</Text>
        </Pressable>
      ))}
      <Modal visible={scenario !== null} animationType="slide" onRequestClose={() => setScenario(null)}>
        <SafeAreaView edges={["top"]} className="flex-1 bg-white">
          <Pressable accessibilityRole="button" accessibilityLabel="설정 미리보기 닫기" onPress={() => setScenario(null)} className="border-b border-grayscale-G100 px-4 py-2">
            <Text className="text-12 font-pretendard-semibold text-primary-main">미리보기 닫기</Text>
          </Pressable>
          <SafeAreaInsetsContext.Consumer>{(insets) => <SafeAreaInsetsContext.Provider value={{ ...insets, top: 0 }}>{scenario ? <PreviewFlow key={scenario} scenario={scenario} onClose={() => setScenario(null)} /> : null}</SafeAreaInsetsContext.Provider>}</SafeAreaInsetsContext.Consumer>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
