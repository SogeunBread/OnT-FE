import { Redirect, Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  const isLoggedIn = false; // TODO: auth state
  const isTrainer = false; // TODO: role state

  // 로그인/역할에 따라 기본 진입 라우트 결정
  // login, trainer 둘 다 false면 devTabs
  const entry = !isLoggedIn
    ? "/(devTabs)" // 로그인 전 임시로 dev로 보내도 됨 (원하면)
    : isTrainer
    ? "/(trainerTabs)/home"
    : "/(userTabs)/home";

  return (
    <>
      <Redirect href={entry} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(userTabs)" />
        <Stack.Screen name="(trainerTabs)" />
        <Stack.Screen name="(devTabs)" />

        {/* 탭 밖 화면 (오류 발생 시 화면) */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
