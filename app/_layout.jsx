import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TrainerChatProvider from "@/features/trainer-chat/TrainerChatProvider";
import TrainerSettingsProvider from "@/features/trainer-settings/TrainerSettingsProvider";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
  });
  if (fontError)
    return (
      <View>
        <Text>글꼴을 불러오지 못했습니다.</Text>
      </View>
    );
  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TrainerChatProvider>
        <TrainerSettingsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(userTabs)" />
          <Stack.Screen name="(trainerTabs)" />
          <Stack.Screen name="(trainer)" />
          <Stack.Screen name="component-preview" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
        </TrainerSettingsProvider>
      </TrainerChatProvider>
    </GestureHandlerRootView>
  );
}
