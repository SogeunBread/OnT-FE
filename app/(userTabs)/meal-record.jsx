import Button from "@/components/button";
import CheckSquare from "@/components/check/CheckSquare";
import Field from "@/components/field";
import FieldLong from "@/components/field-long";
import HeaderDetail from "@/components/header_detail";
import MealDateTimeField from "@/components/meal-record/MealDateTimeField";
import MealPhotoField from "@/components/meal-record/MealPhotoField";
import { format, isValid, parseISO } from "date-fns";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_TITLE_LENGTH = 20;
const MAX_PHOTO_COUNT = 4;
const MAX_CONTENT_LENGTH = 200;

const formatCurrentTime = () => format(new Date(), "HH:mm");

const RequiredMark = () => (
  <Text className="text-14 font-pretendard-semibold text-primary-main">*</Text>
);

const FieldTitle = ({ children, count, required = false }) => (
  <View className="w-full flex-row items-end justify-between">
    <View className="flex-row items-center gap-0.5">
      <Text className="text-14 font-pretendard-semibold text-text">
        {children}
      </Text>
      {required ? <RequiredMark /> : null}
    </View>
    {count ? (
      <Text className="text-12 font-pretendard-regular text-grayscale-G500">
        {count}
      </Text>
    ) : null}
  </View>
);

const MealRecordForm = ({ selectedDate, initialTime, hasMatchedTrainer = false, onSubmit }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [mealContent, setMealContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [mealDateTime, setMealDateTime] = useState(() => {
    const initialValue = parseISO(`${selectedDate}T${initialTime}`);
    return isValid(initialValue) ? initialValue : new Date();
  });

  const handlePressBack = useCallback(() => {
    router.navigate({
      pathname: "/(userTabs)/manage",
      params: { date: selectedDate },
    });
  }, [router, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setMealContent("");
      setPhotos([]);
      setFeedbackRequested(false);
      const initialValue = parseISO(`${selectedDate}T${formatCurrentTime()}`);
      setMealDateTime(isValid(initialValue) ? initialValue : new Date());

      if (Platform.OS !== "android") return;

      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        handlePressBack();
        return true;
      });
      return () => subscription.remove();
    }, [handlePressBack, selectedDate]),
  );

  const handleDateChange = (value) => {
    setMealDateTime((previous) => new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      previous.getHours(),
      previous.getMinutes(),
    ));
  };

  const handleTimeChange = (value) => {
    setMealDateTime((previous) => {
      const next = new Date(previous);
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
      return next;
    });
  };

  const canSubmit = title.trim().length > 0;

  const handlePressSubmit = () => {
    if (!canSubmit) return;
    const date = format(mealDateTime, "yyyy-MM-dd");
    onSubmit?.({
      title: title.trim(),
      date,
      time: format(mealDateTime, "HH:mm"),
      mealContent: mealContent.trim(),
      photos,
      hasMatchedTrainer,
      feedbackRequested,
    });
  };

  return (
    <View className="min-h-0 flex-1 bg-white">
      <HeaderDetail
        actionType="none"
        title="식단 기록"
        subtitle=""
        onPressBack={handlePressBack}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 16,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: hasMatchedTrainer ? 184 : 130,
          }}
        >
          <View className="w-full gap-2">
            <FieldTitle
              required
              count={`${title.length}/${MAX_TITLE_LENGTH}`}
            >
              제목
            </FieldTitle>
            <Field
              className="w-full rounded-lg"
              maxLength={MAX_TITLE_LENGTH}
              placeholder="예: 아침"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="w-full flex-row gap-2.5">
            <View className="min-w-0 flex-1 gap-2">
              <FieldTitle required>날짜</FieldTitle>
              <MealDateTimeField
                label="날짜"
                mode="date"
                value={mealDateTime}
                onChange={handleDateChange}
              />
            </View>
            <View className="min-w-0 flex-1 gap-2">
              <FieldTitle required>식사 시간</FieldTitle>
              <MealDateTimeField
                label="식사 시간"
                mode="time"
                value={mealDateTime}
                onChange={handleTimeChange}
              />
            </View>
          </View>

          <View className="w-full gap-2">
            <FieldTitle count={`${photos.length}/${MAX_PHOTO_COUNT}`}>
              식사 사진
            </FieldTitle>
            <MealPhotoField photos={photos} onChange={setPhotos} maxPhotos={MAX_PHOTO_COUNT} />
          </View>

          <View className="w-full gap-2">
            <FieldTitle
              count={`${mealContent.length}/${MAX_CONTENT_LENGTH}`}
            >
              식사 내용
            </FieldTitle>
            <FieldLong
              className="w-full rounded-lg"
              maxLength={MAX_CONTENT_LENGTH}
              placeholder="식사 내용, 칼로리, 느낀 점 등을 기록"
              value={mealContent}
              onChangeText={setMealContent}
            />
          </View>
        </ScrollView>

        <View
          className={`absolute bottom-0 left-0 right-0 bg-white px-4 ${
            hasMatchedTrainer ? "gap-2.5 border-t border-grayscale-G100 pt-1" : "pt-3"
          }`}
          style={{ paddingBottom: Math.max(insets.bottom, 8) }}
        >
          {hasMatchedTrainer && (
            <CheckSquare
              accessibilityLabel="트레이너 피드백 요청"
              accessibilityState={{ checked: feedbackRequested }}
              aria-checked={feedbackRequested}
              className="w-full gap-4 py-2"
              checked={feedbackRequested}
              onChange={setFeedbackRequested}
            >
              <View className="min-w-0 flex-1">
                <Text className="text-14 font-pretendard-semibold text-text">
                  트레이너 피드백 요청
                </Text>
                <Text className="text-12 font-pretendard-regular text-grayscale-G500">
                  트레이너에게 식단 조언을 받습니다.
                </Text>
              </View>
            </CheckSquare>
          )}
          <Button
            accessibilityLabel="식단 기록 등록"
            className="w-full"
            disabled={!canSubmit}
            text="등록"
            variant={canSubmit ? "fill" : "disabled"}
            onPress={handlePressSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const MatchedTrainerMealRecord = (props) => <MealRecordForm {...props} hasMatchedTrainer />;

const UnmatchedTrainerMealRecord = (props) => <MealRecordForm {...props} hasMatchedTrainer={false} />;

export default function MealRecordScreen({ hasMatchedTrainer = true, onSubmit }) {
  const params = useLocalSearchParams();
  const selectedDate = typeof params.date === "string"
    ? params.date
    : format(new Date(), "yyyy-MM-dd");
  const initialTime = useMemo(formatCurrentTime, []);
  const Screen = hasMatchedTrainer
    ? MatchedTrainerMealRecord
    : UnmatchedTrainerMealRecord;

  return (
    <Screen
      key={selectedDate}
      selectedDate={selectedDate}
      initialTime={initialTime}
      onSubmit={onSubmit}
    />
  );
}
