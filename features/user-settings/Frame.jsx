import { createContext, useContext } from "react";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import HeaderDetail from "@/components/header_detail";
import { settingsRoutes } from "./navigation";
export const SettingsNavigationContext = createContext(null);
export function useSettingsNavigation() {
  const router = useRouter(); const override = useContext(SettingsNavigationContext); const nav = override ?? router;
  return { ...nav, goBack: () => nav.canGoBack() ? nav.back() : nav.replace(settingsRoutes.home) };
}
export default function Frame({ title, children, ...props }) {
  const nav = useSettingsNavigation();
  return <View className="flex-1 bg-white"><HeaderDetail title={title} subtitle="" actionType="none" onPressBack={nav.goBack} {...props} />{children}</View>;
}
export function Empty({ text }) { return <View className="flex-1 items-center justify-center px-4 py-12"><Text className="text-center text-14 font-pretendard-regular text-grayscale-G500">{text}</Text></View>; }
