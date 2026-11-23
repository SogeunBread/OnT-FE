import HeaderDetail from "@/components/header_detail";
import ReviewList from "@/components/review_list";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileReviews({ reviews = [], totalCount = reviews.length, onBack, onPressReview }) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <HeaderDetail title="리뷰" subtitle="" actionType="none" onPressBack={onBack} />
      <Text className="px-4 py-4 text-14 font-pretendard-semibold text-text">리뷰 {totalCount}개</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        {reviews.length ? reviews.map((review, index) => (
          onPressReview ? (
            <Pressable
              key={review.id ?? index}
              accessibilityRole="button"
              accessibilityLabel={`${review.name}님의 리뷰, 답글 작성`}
              onPress={() => onPressReview(review)}
            >
              <ReviewList {...review} />
            </Pressable>
          ) : <ReviewList key={review.id ?? index} {...review} />
        )) : (
          <Text className="px-4 py-8 text-center text-14 font-pretendard-regular text-grayscale-G500">아직 작성된 리뷰가 없어요.</Text>
        )}
      </ScrollView>
    </View>
  );
}
