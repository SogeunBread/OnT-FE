import Avatar from "@/assets/figma/avatar-trainer.svg";
import Verified from "@/assets/figma/verified.svg";
import Rating from "@/assets/figma/rating.svg";
import Compare from "@/assets/figma/compare-trainer.svg";
import Divider from "@/assets/figma/divider.svg";
import { Image, Pressable, Text, View } from "react-native";

export default function TrainerList({
  name = "이름",
  gym = "헬스장",
  demographics = "성별・나이",
  verified = true,
  rating = "5.0",
  reviewCount = "000",
  lessonCount = "00",
  price = "000,000",
  tags = [],
  avatarSource,
  onPress,
  onPressCompare,
  className = "",
}) {
  return (
    <View
      className={`w-full gap-3 border-b border-grayscale-G100 bg-white p-4 ${className}`}
    >
      <View className="flex-row items-start gap-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${name} 트레이너 상세`}
          onPress={onPress}
        >
          {avatarSource ? (
            <Image
              source={
                typeof avatarSource === "string"
                  ? { uri: avatarSource }
                  : avatarSource
              }
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <Avatar />
          )}
        </Pressable>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${name} 프로필`}
          className="min-w-0 flex-1 gap-2"
        >
          <View className="gap-0.5">
            <View className="flex-row items-center gap-0.5">
              <Text
                numberOfLines={1}
                className="shrink text-16 font-pretendard-semibold text-text"
              >
                {name}
              </Text>
              {verified && <Verified />}
            </View>
            <Text
              numberOfLines={1}
              className="text-12 font-pretendard-medium text-grayscale-G500"
            >
              {gym} | {demographics}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Rating />
            <Text className="text-12 font-pretendard-semibold text-text">
              {rating}
              <Text className="font-pretendard-regular text-grayscale-G500">
                {" "}
                ({reviewCount})
              </Text>
            </Text>
          </View>
        </Pressable>
        <View className="items-end gap-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${name} 비교함 담기`}
            onPress={onPressCompare}
            className="flex-row items-center gap-2 rounded-[15px] border border-secondary-blue px-3 py-1.5"
          >
            <Compare />
            <Text className="text-12 font-pretendard-semibold text-secondary-blue">
              비교함 담기
            </Text>
          </Pressable>
          <View className="items-end">
            <Text className="text-[10px] leading-[14px] text-grayscale-G600">
              {lessonCount}회 기준
            </Text>
            <Text className="text-16 font-pretendard-semibold text-text">
              {price}원
            </Text>
          </View>
        </View>
      </View>
      {tags.length > 0 && (
        <>
          <View className="overflow-hidden">
            <Divider />
          </View>
          <View className="flex-row flex-wrap gap-1">
            {tags.map((tag, i) => (
              <View
                key={`${tag}-${i}`}
                className="rounded-full bg-secondary-blue/10 px-2.5 py-1"
              >
                <Text className="text-12 font-pretendard-semibold text-secondary-blue">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
