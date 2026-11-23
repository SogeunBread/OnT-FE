import { Stack } from "expo-router";

export default function TrainerStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile-edit" />
      <Stack.Screen name="profile-reviews" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="member-detail" />
    </Stack>
  );
}
