import Avatar from "@/assets/figma/avatar-trainer.svg";
import Verified from "@/assets/figma/verified.svg";
import Rating from "@/assets/figma/rating.svg";
import { Image, Pressable, Text, View } from "react-native";
import Button from "@/components/button";
const badges = { ended: ["수업 종료", "bg-[#E8F5E9]", "text-[#2E7D32]"], pending: ["신청 중", "bg-secondary-yellow/10", "text-[#E59D00]"], rejected: ["수업 거절", "bg-primary-50", "text-primary-main"], cancelled: ["수업 취소", "bg-grayscale-G50", "text-grayscale-G700"], active: ["수업 중", "bg-secondary-blue/10", "text-secondary-blue"] };
export default function RequestHistoryRow({ item, reviewWritten, reviewDisabled, onProfile, onReview, onEdit }) {
  const trainer = item.trainer; const [label, bg, color] = badges[item.status];
  return <View className="gap-4 border-b border-grayscale-G100 bg-white p-4">
    <View className="flex-row items-start gap-4"><Pressable accessibilityRole="button" accessibilityLabel={`${trainer.name} 트레이너 상세`} onPress={onProfile}>
      {trainer.avatarSource ? <Image source={typeof trainer.avatarSource === "string" ? { uri: trainer.avatarSource } : trainer.avatarSource} className="h-16 w-16 rounded-full" /> : <Avatar />}
    </Pressable><Pressable accessibilityRole="button" accessibilityLabel={`${trainer.name} 프로필`} onPress={onProfile} className="min-w-0 flex-1 gap-2">
      <View className="gap-0.5"><View className="flex-row items-center gap-0.5"><Text numberOfLines={1} className="shrink text-16 font-pretendard-semibold text-text">{trainer.name}</Text>{trainer.verified !== false && <Verified />}</View>
        <Text numberOfLines={1} className="text-12 font-pretendard-medium text-grayscale-G500">{trainer.location?.name ?? trainer.gymName} | {trainer.gender}</Text></View>
      <View className="flex-row items-center gap-1"><Rating /><Text className="text-12 font-pretendard-semibold text-text">{Number(trainer.rating ?? 4.8).toFixed(1)} <Text className="font-pretendard-regular text-grayscale-G600">({trainer.reviewCount ?? 202})</Text></Text></View>
    </Pressable><View className={`shrink-0 rounded-full px-2 py-1 ${bg}`}><Text className={`text-12 font-pretendard-semibold ${color}`}>{label}</Text></View></View>
    {item.status === "ended" && !reviewWritten && <Button text="리뷰 쓰기" variant="weakDark" disabled={reviewDisabled} accessibilityRole="button" onPress={onReview} />}
    {item.status === "pending" && onEdit && <Button text="요청 폼 수정하기" variant="weakDark" accessibilityRole="button" onPress={onEdit} />}
  </View>;
}
