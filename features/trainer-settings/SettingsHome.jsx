import AccountRight from "@/assets/figma/settings-account-right.svg";
import KakaoMark from "@/assets/figma/settings-kakao-mark.svg";
import List from "@/components/list";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function SettingsHome({ account, onProfile, onNotifications, onPastPt, onInquiry, onTerms }) {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 16 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="프로필 설정" onPress={onProfile} className="min-h-[59px] flex-row items-center justify-between px-4 py-4">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Text numberOfLines={1} className="shrink text-18 font-pretendard-bold text-text">{account.name}님</Text>
          {account.loginProvider === "kakao" ? (
            <View accessibilityLabel="카카오 로그인" className="h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FEE500]">
              <KakaoMark />
            </View>
          ) : null}
        </View>
        <AccountRight />
      </Pressable>
      <List title="알림 설정" subtitle="" onPress={onNotifications} />
      <List title="지난 PT 기록" subtitle="" onPress={onPastPt} />
      <List title="1:1 고객 문의" subtitle="" onPress={onInquiry} />
      <List title="약관 및 정책" subtitle="" onPress={onTerms} />
    </ScrollView>
  );
}
