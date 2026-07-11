import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(userTabs)" />
      <Stack.Screen name="(trainerTabs)" />

      {/* 탭 밖 화면 (오류 발생 시 화면) 404~ */}
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="calendar" />
    </Stack>
  );
}
