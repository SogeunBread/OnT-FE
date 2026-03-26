import { Redirect, Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  const isLoggedIn = false;
  const isTrainer = false;

  // 로그인 라우트가 연결되기 전까지 비로그인 사용자는 user 탭으로 보냄
  const entry = !isLoggedIn
    ? "/(userTabs)/home"
    : isTrainer
    ? "/(trainerTabs)/home"
    : "/(userTabs)/home";

  return (
    <>
      <Redirect href={entry} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(userTabs)" />
        <Stack.Screen name="(trainerTabs)" />

        {/* 탭 밖 화면 (오류 발생 시 화면) 404~ */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
