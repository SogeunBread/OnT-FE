import HeaderDetail from "@/components/header_detail";
import RightIcon from "@/components/icons/Right";
import MealCard from "@/components/meal_card";
import { trainerMealFeedbackMembers } from "@/constants/trainerMealFeedback";
import { colors } from "@/tailwind.config";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CARD_STYLE = {
  width: "100%",
  boxShadow: "0px 0px 2px rgba(0,0,0,0.1)",
};

export default function TrainerMealFeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePressBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(trainerTabs)/home");
    }
  };

  const openMemberManage = (member, meal) => {
    // 회원 관리·피드백 작성 상세 연동 시 선택한 회원과 식단 식별자를 사용합니다.
    router.push({
      pathname: "/(trainerTabs)/manage",
      params: {
        memberId: member.id,
        tab: "meal",
        ...(meal && { mealRecordId: meal.id }),
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <HeaderDetail
        title="미처리 식단 피드백"
        subtitle=""
        actionType="none"
        onPressBack={handlePressBack}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          paddingTop: 18,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom, 34) + 16,
        }}
      >
        {trainerMealFeedbackMembers.length === 0 ? (
          <Text className="py-8 text-center text-14 font-pretendard-regular text-grayscale-G500">
            미처리 식단 피드백이 없어요.
          </Text>
        ) : trainerMealFeedbackMembers.map((member) => (
          <View key={member.id} className="gap-4">
            <View className="flex-row items-center justify-between gap-3">
              <Text
                accessibilityRole="header"
                numberOfLines={1}
                className="min-w-0 shrink text-16 font-pretendard-semibold text-text"
              >
                {member.name} 회원
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${member.name} 회원 식단 관리`}
                className="h-6 flex-row items-center gap-1"
                hitSlop={10}
                onPress={() => openMemberManage(member)}
              >
                <Text className="text-14 font-pretendard-regular text-grayscale-G700">
                  관리
                </Text>
                <RightIcon size={16} color={colors.grayscale.G700} />
              </Pressable>
            </View>
            {member.meals.map((meal) => (
              <MealCard
                key={meal.id}
                title={meal.title}
                time={meal.time}
                feedback={meal.feedback}
                thumbnailSource={meal.thumbnailSource}
                thumbnailClassName="!h-[72px] !w-[72px]"
                badgeClassName="!bg-secondary-yellow/30"
                style={CARD_STYLE}
                accessibilityLabel={`${member.name} 회원, ${meal.title}, ${meal.time}, 피드백 대기 중`}
                onPress={() => openMemberManage(member, meal)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
