import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaInsetsContext, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountProfileEditor from "@/components/settings/AccountProfileEditor";
import { validateAccount, normalizeAccount, releaseAccountPhoto } from "@/components/settings/account";
import { userTabs } from "@/constants/userTabs";
import { createMemberSettingsSeed, memberSettingsScenarios, reviewExampleText } from "@/constants/userSettings";
import { createUserTrainerSeed } from "@/constants/userTrainer";
import { discoveryTrainers } from "@/constants/userHome";
import UserTrainerProvider, { useUserTrainer } from "@/features/user-trainer/UserTrainerProvider";
import TrainerMatching from "@/app/(userTabs)/trainer-matching";
import DiscoveryProvider from "@/features/user-home/DiscoveryProvider";
import { initialDiscoveryState } from "@/features/user-home/state";
import { HomeNavigationContext } from "@/features/user-home/FlowNavigation";
import MemberProfileScreen from "@/features/user-home/MemberProfileScreen";
import ReviewsScreen from "@/features/user-home/ReviewsScreen";
import CompareScreen from "@/features/user-home/CompareScreen";
import MemberSettingsProvider, { useMemberSettings } from "./MemberSettingsProvider";
import { SettingsNavigationContext } from "./Frame";
import { settingsRoutes, reviewRoute } from "./navigation";
import { requestHistoryRows } from "./state";
import SettingsHome from "./SettingsHome";
import RequestHistoryScreen from "./RequestHistoryScreen";
import WrittenReviewsScreen from "./WrittenReviewsScreen";
import ReviewScreen from "./ReviewScreen";
import WishlistScreen from "./WishlistScreen";
const initialRoute = scenario => scenario === "account" ? settingsRoutes.account : scenario.startsWith("app-") || scenario.startsWith("notifications-") ? settingsRoutes.notifications : scenario.startsWith("history") ? settingsRoutes.history : scenario.startsWith("review-") ? reviewRoute("lesson-ended") : scenario === "reviews" ? settingsRoutes.reviews : settingsRoutes.home;
function PreviewAccount({ onBack }) {
  const { state, saveAccount } = useMemberSettings(); const [draft, setDraft] = useState({ ...state.account }); const [error, setError] = useState("");
  const original = state.account.avatarSource;
  const draftRef = useRef(draft); draftRef.current = draft; const saved = useRef(false);
  useEffect(() => () => { if (!saved.current && draftRef.current.avatarSource !== original) releaseAccountPhoto(draftRef.current.avatarSource); }, []);
  return <AccountProfileEditor value={draft} error={error} onChange={(key, value) => { if (key === "avatarSource" && draft.avatarSource !== original) releaseAccountPhoto(draft.avatarSource); setDraft(current => ({ ...current, [key]: value })); setError(""); }} onBack={() => { const message = validateAccount(draft); if (message) return setError(message); saved.current = true; saveAccount(normalizeAccount(draft)); onBack(); }} />;
}
function PreviewFlow({ scenario, onClose, trainers }) {
  const { state, send } = useMemberSettings(); const { state: requests, submitRequest } = useUserTrainer();
  const [history, setHistory] = useState(() => [initialRoute(scenario)]);
  const route = history.at(-1); const path = typeof route === "string" ? route : route.pathname; const params = typeof route === "string" ? {} : route.params ?? {};
  const nav = { push: next => setHistory(value => [...value, next]), replace: next => setHistory(value => [...value.slice(0, -1), next]), back: () => history.length > 1 ? setHistory(value => value.slice(0, -1)) : onClose(), canGoBack: () => true,
    dismissTo: next => setHistory(value => { const index = value.findIndex(item => (typeof item === "string" ? item : item.pathname) === next); return index >= 0 ? value.slice(0, index + 1) : [next]; }) };
  let content;
  if (path === settingsRoutes.home) content = <View className="flex-1"><HeaderMain menuName="내 정보" /><SettingsHome /><NavigationBar tabs={userTabs} state={{ routes: userTabs.map(tab => ({ key: tab.name, name: tab.name })), index: 4 }} navigation={{ emit: () => ({ defaultPrevented: false }), navigate: onClose }} /></View>;
  else if (path === settingsRoutes.account) content = <PreviewAccount onBack={nav.back} />;
  else if (path === settingsRoutes.notifications) content = <NotificationSettings value={state.notifications} onChange={(key, value) => send({ type: "notification", key, value })} showAppOptions={scenario.startsWith("app-")} onBack={nav.back} />;
  else if (path === settingsRoutes.history) content = <RequestHistoryScreen rowsOverride={[state.histories[0], ...requestHistoryRows(requests.rooms, trainers)]} />;
  else if (path === settingsRoutes.reviews) content = <WrittenReviewsScreen />;
  else if (path === settingsRoutes.wishlist) content = <WishlistScreen />;
  else if (path.includes("member-review/")) content = <ReviewScreen historyId={params.id} reviewId={params.reviewId} />;
  else if (path.includes("trainer-detail/")) content = <MemberProfileScreen trainerId={params.id} />;
  else if (path.includes("trainer-reviews/")) content = <ReviewsScreen trainerId={params.id} />;
  else if (path.includes("trainer-compare")) content = <CompareScreen />;
  else if (path.includes("request-edit")) {
    const room = requests.rooms.find(item => item.id === params.roomId); const request = room?.requests.find(item => item.id === params.requestId);
    content = <TrainerMatching initialAnswers={request?.answers ?? {}} onCancel={nav.back} onComplete={(_, details) => { if (submitRequest(params.roomId, details, params.requestId)) nav.dismissTo(settingsRoutes.history); }} />;
  } else content = <Text className="p-4 text-14">실제 화면에서 이어서 확인할 수 있어요.</Text>;
  return <SettingsNavigationContext.Provider value={nav}><HomeNavigationContext.Provider value={nav}>{content}</HomeNavigationContext.Provider></SettingsNavigationContext.Provider>;
}
function PreviewProviders({ scenario, onClose }) {
  const data = useMemo(() => {
    const seed = createMemberSettingsSeed(); const requests = createUserTrainerSeed();
    const trainers = discoveryTrainers.map(item => ({ ...item }));
    const names = ["노유나", "김성민", "이채린", "박준영", "최유진"];
    seed.histories.slice(2).forEach((item, i) => { const trainer = trainers.find(trainer => trainer.id === item.trainerId); trainer.name = names[i]; item.trainer = trainer; seed.reviews[i].createdAt = `2024-05-${String(20 - i).padStart(2, "0")}T12:00:00+09:00`; });
    seed.histories[0].trainer = { ...seed.histories[0].trainer, name: "이민주" };
    requests.rooms = requests.rooms.slice(0, 4).map((room, i) => ({ ...room, matched: i === 3, trainerId: ["minha", "jaemin", "nayeon", "jiwu"][i], trainer: { ...trainers.find(item => item.id === ["minha", "jaemin", "nayeon", "jiwu"][i]) }, requests: [{ ...room.requests[0], status: ["pending", "rejected", "cancelled", "accepted"][i] }] }));
    if (scenario === "apple") seed.account.loginProvider = "apple";
    if (scenario.endsWith("-on")) seed.notifications = Object.fromEntries(Object.keys(seed.notifications).map(key => [key, true]));
    if (scenario === "history-expired") seed.histories[0].endedAt = new Date(Date.now() - 91 * 86400000).toISOString();
    if (scenario === "history-reviewed") seed.reviews.unshift({ id: "preview-reviewed", historyId: "lesson-ended", trainerId: "minju", rating: 4, text: reviewExampleText, createdAt: new Date().toISOString() });
    if (scenario.startsWith("review-")) seed.drafts["create:lesson-ended"] = { rating: scenario === "review-ready" ? 4 : 0, text: scenario === "review-empty" ? "" : reviewExampleText };
    return { seed, requests, trainers };
  }, [scenario]);
  return <UserTrainerProvider initialSeed={data.requests}><DiscoveryProvider trainers={data.trainers} initialState={{ ...initialDiscoveryState, liked: ["minju", "nayeon"] }}><MemberSettingsProvider initialSeed={data.seed}><PreviewFlow scenario={scenario} onClose={onClose} trainers={data.trainers} /></MemberSettingsProvider></DiscoveryProvider></UserTrainerProvider>;
}
export default function SettingsPreview() {
  const [scenario, setScenario] = useState(null); const params = useLocalSearchParams(); const insets = useSafeAreaInsets();
  useEffect(() => { if (memberSettingsScenarios.some(item => item[2] === params.settingsScenario)) setScenario(params.settingsScenario); }, [params.settingsScenario]);
  return <View className="gap-2">{memberSettingsScenarios.map(([id, label, key]) => <Pressable key={id} accessibilityRole="button" accessibilityLabel={`회원 설정 미리보기 ${label}`} onPress={() => setScenario(key)} className="rounded-lg bg-white px-3 py-2"><Text className="text-14 font-pretendard-medium text-text">{label}</Text><Text className="text-12 text-grayscale-G500">{id}</Text></Pressable>)}
    <Modal visible={!!scenario} animationType="slide" onRequestClose={() => setScenario(null)}><SafeAreaView edges={["top"]} className="flex-1 bg-white"><Pressable accessibilityRole="button" accessibilityLabel="회원 설정 미리보기 닫기" onPress={() => setScenario(null)} className="border-b border-grayscale-G100 px-4 py-2"><Text className="text-12 text-primary-main">미리보기 닫기</Text></Pressable><SafeAreaInsetsContext.Provider value={{ ...insets, top: 0 }}>{scenario && <PreviewProviders key={scenario} scenario={scenario} onClose={() => setScenario(null)} />}</SafeAreaInsetsContext.Provider></SafeAreaView></Modal>
  </View>;
}
