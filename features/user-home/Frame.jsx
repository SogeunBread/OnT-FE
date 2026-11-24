import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderDetail from "@/components/header_detail";
import Button from "@/components/button";
import { useDiscovery } from "./DiscoveryProvider";
import { useHomeNavigation } from "./FlowNavigation";
export function Footer({ children }) {
 const insets = useSafeAreaInsets();
 return <View className="border-t border-grayscale-G100 bg-white px-4 pt-2.5" style={{ paddingBottom: Math.max(insets.bottom, 10) }}>{children}</View>;
}
export default function Frame({ title, children, footer, ...header }) {
 const nav = useHomeNavigation();
 const { notice, setNotice } = useDiscovery();
 return <View className="flex-1 bg-white"><HeaderDetail title={title} subtitle="" actionType="none" onPressBack={nav.goBack} {...header} />
  <View className="min-h-0 flex-1">{children}</View>
  {notice ? <Pressable accessibilityRole="button" accessibilityLabel="안내 닫기" onPress={() => setNotice("")} className="bg-primary-50 px-4 py-3"><Text accessibilityRole="alert" className="text-14 text-text">{notice}</Text></Pressable> : null}
  {footer ? <Footer>{footer}</Footer> : null}
 </View>;
}
export function Empty({ text = "검색 결과가 없어요.", onPress, button = "돌아가기" }) {
 return <View className="flex-1 items-center justify-center gap-4 px-4"><Text className="text-center text-14 text-grayscale-G500">{text}</Text>{onPress && <Button text={button} accessibilityRole="button" onPress={onPress} />}</View>;
}
