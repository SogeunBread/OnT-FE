import { createUserTrainerMeals } from "@/constants/userTrainerMeals";
import UserTrainerProvider from "@/features/user-trainer/UserTrainerProvider";
import { ExerciseProvider } from "@/features/exercise/ExerciseProvider";
import { MealRecordsProvider } from "@/components/meal-record/MealRecordsContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TrainerChatProvider from "@/features/trainer-chat/TrainerChatProvider";
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
      <ExerciseProvider>
        <MealRecordsProvider additionalRecords={createUserTrainerMeals()}>
          <UserTrainerProvider>
            <TrainerChatProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(userTabs)" />
                <Stack.Screen name="(trainerTabs)" />
                <Stack.Screen name="(trainer)" />
                <Stack.Screen name="(exerciseFlow)" />
                <Stack.Screen name="(userTrainerFlow)" />
                <Stack.Screen name="component-preview" />
                <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              </Stack>
            </TrainerChatProvider>
          </UserTrainerProvider>
        </MealRecordsProvider>
      </ExerciseProvider>
    </GestureHandlerRootView>
  );
}
