import Avatar from "@/assets/figma/avatar-review.svg";
import ReviewStar from "@/assets/figma/review-star.svg";
import Star from "@/components/star";
import { Image, Text, View } from "react-native";

export default function ReviewList({
  name = "이름",
  content = "리뷰 내용",
  date = "0000.00.00",
  rating = 5,
  avatarSource,
  className = "",
}) {
  const score = Number.isFinite(rating)
    ? Math.max(0, Math.min(5, Math.round(rating)))
    : 0;
  return (
    <View
      className={`w-full flex-row items-start gap-4 border-b border-grayscale-G50 bg-white px-4 py-3 ${className}`}
    >
      {avatarSource ? (
        <Image
          accessibilityLabel={`${name} 프로필`}
          source={
            typeof avatarSource === "string"
              ? { uri: avatarSource }
              : avatarSource
          }
          className="h-[52px] w-[52px] rounded-full"
        />
      ) : (
        <View className="h-[52px] w-[52px] overflow-hidden rounded-full">
          <Avatar />
        </View>
      )}
      <View className="min-w-0 flex-1 gap-1">
        <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
          <Text
            numberOfLines={1}
            className="max-w-full shrink text-14 font-pretendard-semibold text-text"
          >
            {name}
          </Text>
          <View
            accessible
            accessibilityLabel={`별점 ${score}점, 5점 만점`}
            className="flex-row gap-px"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                active={value <= score}
                activeIcon={ReviewStar}
              />
            ))}
          </View>
          <Text className="text-12 font-pretendard-regular text-grayscale-G400">
            {date}
          </Text>
        </View>
        <Text className="text-12 font-pretendard-regular text-grayscale-G700">
          {content}
        </Text>
      </View>
    </View>
  );
}
