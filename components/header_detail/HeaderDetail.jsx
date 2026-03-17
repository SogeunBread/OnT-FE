import Heart from "@/components/heart/Heart";
import CompareIcon from "@/components/icons/Compare";
import LeftIcon from "@/components/icons/Left";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HeaderDetail = ({
  title = "메인 텍스트",
  subtitle = "서브 텍스트",
  actionType = "heart",
  liked,
  defaultLiked = false,
  onHeartChange,
  onPressBack,
  onPressCompare,
  compareLabel = "비교함 담기",
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const showSubtitle = Boolean(subtitle);
  const showHeart = actionType === "heart";
  const showCompare = actionType === "compare";

  const handlePressBack = () => {
    if (onPressBack) {
      onPressBack();
      return;
    }

    router.back();
  };

  return (
    <View
      className="border-b border-grayscale-G100 bg-white px-4"
      style={{ paddingTop: insets.top }}
    >
      <View className="h-[70px] flex-row items-center gap-6">
        <Pressable
          accessibilityLabel="뒤로가기"
          accessibilityRole="button"
          className="h-6 w-6 items-center justify-center"
          hitSlop={8}
          onPress={handlePressBack}
        >
          <LeftIcon />
        </Pressable>

        <View className="flex-1">
          <Text
            className="text-18 font-pretendard-bold text-text"
            numberOfLines={1}
          >
            {title}
          </Text>
          {showSubtitle ? (
            <Text
              className="text-12 font-pretendard-regular text-grayscale-G600"
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {showHeart ? (
          <Heart
            className="m-auto"
            liked={liked}
            defaultLiked={defaultLiked}
            onChange={onHeartChange}
          />
        ) : null}

        {showCompare ? (
          <Pressable
            accessibilityLabel={compareLabel}
            accessibilityRole="button"
            className="flex-row items-center gap-2 rounded-full border border-secondary-blue px-3 py-1.5"
            hitSlop={8}
            onPress={onPressCompare}
          >
            <CompareIcon color="#62B1FF" size={16} />
            <Text className="text-12 font-pretendard-semibold text-secondary-blue">
              {compareLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default HeaderDetail;
