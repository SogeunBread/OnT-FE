import Avatar from "@/assets/figma/avatar-chat.svg";
import HeaderDetail from "@/components/header_detail";
import { Image, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PastPtRecords({ records, onBack }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white">
      <HeaderDetail title="지난 PT 기록" subtitle="" actionType="none" onPressBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {records.length === 0 ? (
          <Text className="px-4 py-8 text-center text-14 font-pretendard-regular text-grayscale-G600">지난 PT 기록이 없어요.</Text>
        ) : records.map((record) => (
          <View key={record.id} className="w-full flex-row items-center gap-3 border-b border-grayscale-G50 bg-white px-4 py-3">
            <View className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full">
              {record.avatarSource ? <Image source={typeof record.avatarSource === "string" ? { uri: record.avatarSource } : record.avatarSource} className="h-[52px] w-[52px] rounded-full" /> : <Avatar />}
            </View>
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="text-14 font-pretendard-semibold text-text">{record.name} 회원</Text>
              <Text numberOfLines={1} className="text-12 font-pretendard-regular text-grayscale-G700">{record.startDate} - {record.endDate}・{record.lessonCount}회 진행</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
