import Heart from "@/components/heart/Heart";
import CompareIcon from "@/assets/figma/compare.svg";
import HeartIcon from "@/assets/figma/heart.svg";
import ButtonSmall from "@/components/button/ButtonSmall";
import LeftIcon from "@/assets/figma/left.svg";
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
  buttonLabel = "관리",
  onPressAction,
  includeSafeArea = true,
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
      style={{ paddingTop: includeSafeArea ? insets.top : 0 }}
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

        <View className="min-w-0 flex-1">
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
            inactiveIcon={HeartIcon}
            liked={liked}
            defaultLiked={defaultLiked}
            onChange={onHeartChange}
          />
        ) : null}

        {actionType === "button" && (
          <ButtonSmall
            text={buttonLabel}
            onPress={onPressAction}
            accessibilityRole="button"
          />
        )}

        {showCompare ? (
          <Pressable
            accessibilityLabel={compareLabel}
            accessibilityRole="button"
            className="flex-row items-center gap-2 rounded-full border border-secondary-blue px-3 py-1.5"
            hitSlop={8}
            onPress={onPressCompare}
          >
            <CompareIcon />
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
