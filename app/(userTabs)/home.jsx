import BottomSheetMeal, {
  BOTTOM_SHEET_MEAL_FEEDBACK,
} from "@/components/bottom_sheet_meal";
import Button from "@/components/button";
import { useState } from "react";
import { Text, View } from "react-native";

const feedbackOptions = [
  { label: "완료", value: BOTTOM_SHEET_MEAL_FEEDBACK.DONE },
  { label: "대기", value: BOTTOM_SHEET_MEAL_FEEDBACK.WAITING },
  { label: "미신청", value: BOTTOM_SHEET_MEAL_FEEDBACK.NOT_REQUESTED },
  { label: "트레이너 없음", value: BOTTOM_SHEET_MEAL_FEEDBACK.TRAINER_NONE },
];

export default function UserHomeTab() {
  const [visible, setVisible] = useState(true);
  const [feedback, setFeedback] = useState(BOTTOM_SHEET_MEAL_FEEDBACK.DONE);

  return (
    <View className="flex-1 bg-white px-4 pt-8">
      <View className="gap-5">
        <View className="gap-2">
          <Text className="text-20 font-pretendard-bold text-text">
            BottomSheetMeal 테스트
          </Text>
          <Text className="text-14 font-pretendard-regular text-grayscale-G700">
            버튼으로 피드백 상태를 바꿔가며 바텀시트를 확인할 수 있습니다.
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {feedbackOptions.map((option) => (
            <Button
              key={option.value}
              text={option.label}
              variant={feedback === option.value ? "fill" : "weak"}
              onPress={() => {
                setFeedback(option.value);
                setVisible(true);
              }}
            />
          ))}
        </View>

        <Button
          text={visible ? "바텀시트 닫기" : "바텀시트 열기"}
          variant="weakDark"
          onPress={() => setVisible((current) => !current)}
        />
      </View>

      <BottomSheetMeal
        visible={visible}
        date="2026년 5월 28일 (목)"
        title="점심 식단 기록"
        time="12:30"
        mealContent="현미밥 1공기, 닭가슴살 샐러드, 삶은 달걀 2개, 아메리카노를 먹었습니다."
        feedback={feedback}
        trainerName="김민수 트레이너"
        trainerFeedback="단백질 구성이 좋습니다. 저녁에는 채소 양을 조금 더 늘려보세요."
        feedbackTime="15분 전"
        photos={[
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
        ]}
        onEdit={() => {}}
        onDelete={() => {}}
        onClose={() => setVisible(false)}
      />
    </View>
  );
}
