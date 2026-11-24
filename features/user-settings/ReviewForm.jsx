import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Star from "@/components/star";
import StarOn from "@/assets/figma/settings/review-star-on.svg";
import StarOff from "@/assets/figma/settings/review-star-off.svg";
import FieldLong from "@/components/field-long";
import Button from "@/components/button";
export default function ReviewForm({ trainer, value, onChange, onSave, disabled, error }) {
  const insets = useSafeAreaInsets();
  return <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 20, paddingBottom: 24 }}><View className="items-center gap-0.5">
      <Text className="text-18 font-pretendard-bold text-text">{trainer.name}</Text><Text className="text-14 font-pretendard-medium text-grayscale-G600">{trainer.location?.name ?? trainer.gymName}</Text>
      <View className="mt-3 flex-row">{[1, 2, 3, 4, 5].map(rating => <Star key={rating} active={rating <= value.rating} activeIcon={StarOn} inactiveIcon={StarOff} accessibilityLabel={`${rating}점`} onPress={() => onChange({ ...value, rating })} />)}</View>
    </View><View className="mt-6 px-4"><FieldLong className="!w-full !rounded-lg" accessibilityLabel="리뷰 내용" placeholder="다른 회원들에게 도움이 되도록 평가를 남겨주세요." value={value.text} onChangeText={text => onChange({ ...value, text })} />
      {!!error && <Text accessibilityRole="alert" className="mt-3 text-14 text-primary-main">{error}</Text>}
    </View></ScrollView><View className="px-4 pt-2.5" style={{ paddingBottom: Math.max(insets.bottom, 34) + 10 }}><Button text="완료" variant="fill" disabled={disabled} accessibilityRole="button" onPress={onSave} /></View>
  </KeyboardAvoidingView>;
}
