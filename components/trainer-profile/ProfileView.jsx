import Avatar from "@/assets/figma/profile-avatar.svg";
import AvatarComplete from "@/assets/figma/avatar-trainer.svg";
import Verified from "@/assets/figma/verified.svg";
import Rating from "@/assets/figma/rating.svg";
import ReviewRight from "@/assets/figma/profile-review-right.svg";
import ButtonSmall from "@/components/button/ButtonSmall";
import Tag from "@/components/tag";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { formatCareerEndDate } from "./profile-date";

export const formatPrice = (value) => Number(value || 0).toLocaleString("ko-KR");
export const formatMonth = (value) => value ? value.slice(0, 7).replace("-", ".") : "현재";

function Section({ title, empty, children, hasContent }) {
  return (
    <View className="gap-2">
      <Text className="text-16 font-pretendard-semibold text-text">{title}</Text>
      {hasContent ? children : <Text className="text-14 font-pretendard-regular text-grayscale-G500">{empty}</Text>}
    </View>
  );
}

export function DetailCard({ title, first, second, children, leading, className = "" }) {
  return (
    <View className={`flex-row items-center gap-3 rounded-lg border border-grayscale-G100 p-3 ${className}`}>
      {leading}
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-14 font-pretendard-semibold text-text">{title}</Text>
        <View className="flex-row flex-wrap items-center gap-x-2 gap-y-0.5">
          <Text className="text-12 font-pretendard-regular text-grayscale-G500">{first}</Text>
          {second ? <><View className="h-2 w-px bg-grayscale-G200" /><Text className="text-12 font-pretendard-regular text-grayscale-G500">{second}</Text></> : null}
        </View>
      </View>
      {children}
    </View>
  );
}

export function Benefit({ children }) {
  return children ? <View className="self-start rounded bg-primary-50 px-1 py-0.5"><Text className="text-[11px] leading-[16.5px] font-pretendard-semibold text-primary-main">{children}</Text></View> : null;
}

export default function ProfileView({ profile, onEdit, onReviews, onPressMap }) {
  const avatarSize = profile.specialties.length ? 64 : 60;
  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="gap-4 border-b-8 border-grayscale-G50 px-4 py-3">
        <View className="flex-row items-center gap-3">
          <View className="overflow-hidden rounded-full" style={{ width: avatarSize, height: avatarSize }}>
            {profile.avatarSource ? <Image accessibilityLabel="트레이너 프로필 사진" source={typeof profile.avatarSource === "string" ? { uri: profile.avatarSource } : profile.avatarSource} style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }} /> : profile.specialties.length ? <AvatarComplete /> : <Avatar />}
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <View className="flex-row flex-wrap items-center gap-1">
              <Text className="shrink text-16 font-pretendard-semibold text-text">{profile.name} 트레이너</Text>
              {profile.verified ? <View accessibilityLabel="전문 트레이너 인증"><Verified /></View> : null}
            </View>
            <Text className="text-12 font-pretendard-medium text-grayscale-G500">{profile.gender}・{profile.age}세</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`리뷰 ${profile.reviewCount}개 보기`} disabled={!profile.reviewCount} onPress={onReviews} className="flex-row items-center gap-1 self-start" hitSlop={8}>
              <Rating />
              <Text className="text-12 font-pretendard-semibold text-text">{profile.rating.toFixed(1)}<Text className="font-pretendard-regular text-grayscale-G500"> ({profile.reviewCount})</Text></Text>
              {profile.reviewCount > 0 ? <ReviewRight /> : null}
            </Pressable>
          </View>
          <ButtonSmall text="프로필 수정" accessibilityRole="button" onPress={onEdit} />
        </View>
        {profile.specialties.length ? <View className="flex-row flex-wrap gap-1.5">{profile.specialties.map((text) => <Tag key={text} text={text} />)}</View> : null}
      </View>
      <ProfileSections profile={profile} onPressMap={onPressMap} />
    </ScrollView>
  );
}

export function ProfileSections({ profile, includeIntroduction = true, locationLeading, onPressMap }) {
  return (
    <View className="gap-5 px-4 pt-5">
        {includeIntroduction && <Section title="소개글" empty="아직 작성한 소개글이 없어요." hasContent={Boolean(profile.introduction)}><Text className="text-14 font-pretendard-regular text-text">{profile.introduction}</Text></Section>}
        <Section title="수업 위치" empty="아직 등록한 수업 위치 정보가 없어요." hasContent={Boolean(profile.location)}>
          {profile.location ? <Pressable accessibilityRole="button" accessibilityLabel="수업 위치 지도에서 보기" onPress={() => onPressMap?.(profile.location)}><DetailCard leading={locationLeading} title={profile.location.name} first={[profile.location.address, profile.location.detailAddress].filter(Boolean).join(" ")} /></Pressable> : null}
        </Section>
        <Section title="가격" empty="아직 등록한 가격 정보가 없어요." hasContent={profile.prices.length > 0}>
          <View className="rounded-lg border border-grayscale-G100 px-3 py-1">
            {profile.prices.map((item, index) => <View key={item.id} className={`gap-1 py-2 ${index ? "border-t border-grayscale-G100" : ""}`}>
              <Benefit>{item.benefit}</Benefit><View className="flex-row items-center justify-between gap-2"><Text className="text-14 font-pretendard-regular text-text">{item.count}회</Text><Text className="text-14 font-pretendard-semibold text-text">{formatPrice(item.price)}원</Text></View>
            </View>)}
          </View>
        </Section>
        <Section title="경력" empty="아직 작성한 경력 사항이 없어요." hasContent={profile.careers.length > 0}>
          <View className="rounded-lg border border-grayscale-G100 px-3">{profile.careers.map((item, index) => <DetailCard key={item.id} className={`rounded-none border-0 px-0 ${index ? "border-t border-grayscale-G100" : ""}`} title={item.name} first={`${formatMonth(item.startDate)} - ${formatCareerEndDate(item.endDate)}`} second={item.position} />)}</View>
        </Section>
        <Section title="자격증" empty="아직 등록한 자격증이 없어요." hasContent={profile.certificates.length > 0}>
          <View className="rounded-lg border border-grayscale-G100 px-3">{profile.certificates.map((item, index) => <DetailCard key={item.id} className={`rounded-none border-0 px-0 ${index ? "border-t border-grayscale-G100" : ""}`} title={item.name} first={`${formatMonth(item.acquiredDate)} 취득`} second={item.issuer} />)}</View>
        </Section>
      </View>
  );
}
