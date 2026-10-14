import Button from "@/components/button";
import CheckSquare from "@/components/check/CheckSquare";
import Field from "@/components/field";
import FieldLong from "@/components/field-long";
import HeaderDetail from "@/components/header_detail";
import MealDateTimeField from "@/components/meal-record/MealDateTimeField";
import MealPhotoField from "@/components/meal-record/MealPhotoField";
import { useMealRecords } from "@/components/meal-record/MealRecordsContext";
import { canRecordMealOnDate } from "@/components/meal-record/meal-record-date";
import { MEAL_CARD_FEEDBACK } from "@/components/meal_card/MealCard";
import { colors } from "@/tailwind.config";
import { endOfDay, format, parseISO } from "date-fns";
import {
  Redirect,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_PHOTO_COUNT = 4;
const MAX_CONTENT_LENGTH = 200;
const LOCKED_FEEDBACK_BOX_STYLE = {
  backgroundColor: colors.primary[100],
  borderColor: colors.primary[100],
};

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

const MealRecordForm = ({
  selectedDate,
  initialTime,
  initialRecord,
  hasMatchedTrainer = false,
  onSubmit,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { today } = useMealRecords();
  const [title, setTitle] = useState("");
  const [mealContent, setMealContent] = useState("");
  const [photos, setPhotos] = useState([]);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const feedbackLocked = Boolean(initialRecord?.feedbackRequested);
  const isFeedbackRequested = feedbackLocked || feedbackRequested;
  const retainedPhotoUris = useMemo(
    () => initialRecord?.photos.map(({ uri }) => uri) ?? [],
    [initialRecord],
  );
  const submitted = useRef(false);
  const [mealDateTime, setMealDateTime] = useState(() => {
    const initialValue = parseISO(`${selectedDate}T${initialTime}`);
    return canRecordMealOnDate(initialValue) ? initialValue : new Date();
  });

  const handlePressBack = useCallback(() => {
    router.navigate({
      pathname: "/(userTabs)/manage",
      params: { date: selectedDate },
    });
  }, [router, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      submitted.current = false;
      setTitle(initialRecord?.title ?? "");
      setMealContent(initialRecord?.mealContent ?? "");
      setPhotos(initialRecord?.photos ?? []);
      setFeedbackRequested(initialRecord?.feedbackRequested ?? false);
      const initialValue = parseISO(
        `${selectedDate}T${initialRecord?.time ?? formatCurrentTime()}`,
      );
      setMealDateTime(
        canRecordMealOnDate(initialValue) ? initialValue : new Date(),
      );

      if (Platform.OS !== "android") return;

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handlePressBack();
          return true;
        },
      );
      return () => subscription.remove();
    }, [handlePressBack, selectedDate, initialRecord]),
  );

  const handleDateChange = (value) => {
    if (!canRecordMealOnDate(value)) return;
    setMealDateTime(
      (previous) =>
        new Date(
          value.getFullYear(),
          value.getMonth(),
          value.getDate(),
          previous.getHours(),
          previous.getMinutes(),
        ),
    );
  };

  const handleTimeChange = (value) => {
    setMealDateTime((previous) => {
      const next = new Date(previous);
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
      return next;
    });
  };

  const canSubmit =
    title.trim().length > 0 && canRecordMealOnDate(mealDateTime, today);

  const handlePressSubmit = () => {
    if (
      !canSubmit ||
      !canRecordMealOnDate(mealDateTime) ||
      submitted.current ||
      !onSubmit
    )
      return;
    submitted.current = true;
    const date = format(mealDateTime, "yyyy-MM-dd");
    const result = onSubmit({
      title: title.trim(),
      date,
      time: format(mealDateTime, "HH:mm"),
      mealContent: mealContent.trim(),
      photos,
      hasMatchedTrainer,
      feedbackRequested: isFeedbackRequested,
    });
    if (result === false) submitted.current = false;
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
            <FieldTitle required>제목</FieldTitle>
            <Field
              className="w-full rounded-lg"
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
                maximumDate={endOfDay(today)}
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
            <MealPhotoField
              photos={photos}
              onChange={setPhotos}
              maxPhotos={MAX_PHOTO_COUNT}
              retainedPhotoUris={retainedPhotoUris}
            />
          </View>

          <View className="w-full gap-2">
            <FieldTitle count={`${mealContent.length}/${MAX_CONTENT_LENGTH}`}>
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
            hasMatchedTrainer
              ? "gap-2.5 border-t border-grayscale-G100 pt-1"
              : "pt-3"
          }`}
          style={{ paddingBottom: Math.max(insets.bottom, 34) }}
        >
          {hasMatchedTrainer && (
            <CheckSquare
              accessibilityLabel="트레이너 피드백 요청"
              accessibilityState={{
                checked: isFeedbackRequested,
                disabled: feedbackLocked,
              }}
              aria-checked={isFeedbackRequested}
              className="w-full gap-4 py-2"
              style={feedbackLocked ? { opacity: 1 } : undefined}
              boxStyle={feedbackLocked ? LOCKED_FEEDBACK_BOX_STYLE : undefined}
              checked={isFeedbackRequested}
              disabled={feedbackLocked}
              onChange={feedbackLocked ? undefined : setFeedbackRequested}
            >
              <View className="min-w-0 flex-1">
                <Text
                  className={`text-14 font-pretendard-semibold ${
                    feedbackLocked ? "text-grayscale-G400" : "text-text"
                  }`}
                >
                  트레이너 피드백 요청
                </Text>
                <Text
                  className={`text-12 font-pretendard-regular ${
                    feedbackLocked
                      ? "text-grayscale-G300"
                      : "text-grayscale-G500"
                  }`}
                >
                  {feedbackLocked
                    ? "이미 요청한 피드백은 번복할 수 없습니다."
                    : "트레이너에게 식단 조언을 받습니다."}
                </Text>
              </View>
            </CheckSquare>
          )}
          <Button
            accessibilityLabel={
              initialRecord ? "식단 기록 수정" : "식단 기록 등록"
            }
            className="w-full"
            disabled={!canSubmit}
            text={initialRecord ? "저장" : "등록"}
            variant={canSubmit ? "fill" : "disabled"}
            onPress={handlePressSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const MatchedTrainerMealRecord = (props) => (
  <MealRecordForm {...props} hasMatchedTrainer />
);

const UnmatchedTrainerMealRecord = (props) => (
  <MealRecordForm {...props} hasMatchedTrainer={false} />
);

export default function MealRecordScreen({
  hasMatchedTrainer = true,
  onSubmit,
}) {
  const router = useRouter();
  const { records, addRecord, updateRecord } = useMealRecords();
  const params = useLocalSearchParams();
  const editingId =
    typeof params.recordId === "string" ? params.recordId : null;
  const initialRecord = records.find((record) => record.id === editingId);
  const selectedDate =
    initialRecord?.date ??
    (typeof params.date === "string"
      ? params.date
      : format(new Date(), "yyyy-MM-dd"));
  const initialTime = useMemo(formatCurrentTime, []);
  const Screen =
    initialRecord?.hasMatchedTrainer ?? hasMatchedTrainer
      ? MatchedTrainerMealRecord
      : UnmatchedTrainerMealRecord;

  const handleRegister = (draft) => {
    const record = editingId
      ? updateRecord(editingId, draft)
      : addRecord(draft);
    if (!record) return false;
    router.navigate({
      pathname: "/(userTabs)/manage",
      params: { date: record.date },
    });
  };

  if (
    editingId &&
    (!initialRecord || initialRecord.feedback === MEAL_CARD_FEEDBACK.DONE)
  ) {
    return <Redirect href="/(userTabs)/manage" />;
  }

  return (
    <Screen
      key={editingId ?? selectedDate}
      selectedDate={selectedDate}
      initialTime={initialRecord?.time ?? initialTime}
      initialRecord={initialRecord}
      onSubmit={onSubmit ?? handleRegister}
    />
  );
}
