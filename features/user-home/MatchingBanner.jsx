import { Pressable, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import Small from "@/assets/figma/home-banner-person-small.svg";
import Large from "@/assets/figma/home-banner-person-large.svg";
import Arrow from "@/assets/figma/home-banner-right.svg";
export default function MatchingBanner({ onPress }) {
 return <Pressable accessibilityRole="button" accessibilityLabel="트레이너 매칭" onPress={onPress} className="relative w-full overflow-hidden rounded-xl p-4">
  <View className="absolute inset-0"><Svg width="100%" height="100%"><Defs><LinearGradient id="homeBanner" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#EF6346"/><Stop offset="1" stopColor="#BC2D10"/></LinearGradient></Defs><Rect width="100%" height="100%" fill="url(#homeBanner)"/></Svg></View>
  <View pointerEvents="none" className="absolute" style={{ right: 80.3, top: 33.8 }}><Small /></View>
  <View pointerEvents="none" className="absolute" style={{ right: 20.8, top: 4.8 }}><Large /></View>
  <View className="mb-5"><Text className="text-12 font-pretendard-regular text-primary-100">나에게 딱맞는</Text><Text className="text-18 font-pretendard-bold text-white">트레이너 매칭</Text></View>
  <View className="flex-row items-center justify-between gap-2"><Text className="min-w-0 flex-1 text-12 font-pretendard-regular text-white">조건에 맞는 트레이너를 추천해드릴게요.</Text><View className="h-7 w-7 items-center justify-center rounded-full bg-white/80"><Arrow /></View></View>
 </Pressable>;
}
