import AppleMark from "@/assets/figma/settings/settings-apple-mark.svg";
import KakaoMark from "@/assets/figma/settings-kakao-mark.svg";
import AccountRight from "@/assets/figma/settings-account-right.svg";
import { Pressable, Text, View } from "react-native";
export default function AccountIdentity({ account, onPress }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="프로필 설정" onPress={onPress} className="min-h-[59px] flex-row items-center justify-between px-4 py-4">
    <View className="min-w-0 flex-1 flex-row items-center gap-2"><Text numberOfLines={1} className="shrink text-18 font-pretendard-bold text-text">{account.name}님</Text>
      {account.loginProvider === "kakao" ? <View accessibilityLabel="카카오 로그인" className="h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FEE500]"><KakaoMark /></View> : account.loginProvider === "apple" ? <View accessibilityLabel="Apple 로그인"><AppleMark /></View> : null}
    </View><AccountRight />
  </Pressable>;
}
