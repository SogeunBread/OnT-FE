import Button from "@/components/button";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  Image,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export const BOTTOM_SHEET_MEAL_FEEDBACK = Object.freeze({
  DONE: "done",
  WAITING: "waiting",
  NOT_REQUESTED: "notRequested",
  TRAINER_NONE: "trainerNone",
});

const FEEDBACK_ALIASES = {
  true: BOTTOM_SHEET_MEAL_FEEDBACK.DONE,
  done: BOTTOM_SHEET_MEAL_FEEDBACK.DONE,
  "피드백 완료": BOTTOM_SHEET_MEAL_FEEDBACK.DONE,
  waiting: BOTTOM_SHEET_MEAL_FEEDBACK.WAITING,
  "피드백 대기": BOTTOM_SHEET_MEAL_FEEDBACK.WAITING,
  "피드백 대기 중": BOTTOM_SHEET_MEAL_FEEDBACK.WAITING,
  false: BOTTOM_SHEET_MEAL_FEEDBACK.NOT_REQUESTED,
  notRequested: BOTTOM_SHEET_MEAL_FEEDBACK.NOT_REQUESTED,
  "피드백 미신청": BOTTOM_SHEET_MEAL_FEEDBACK.NOT_REQUESTED,
  "trainer-none": BOTTOM_SHEET_MEAL_FEEDBACK.TRAINER_NONE,
  trainerNone: BOTTOM_SHEET_MEAL_FEEDBACK.TRAINER_NONE,
  none: BOTTOM_SHEET_MEAL_FEEDBACK.TRAINER_NONE,
};

const DEFAULT_PHOTO_SLOTS = [];

const normalizeFeedback = (feedback) => {
  if (feedback === true) return BOTTOM_SHEET_MEAL_FEEDBACK.DONE;
  if (feedback === false) return BOTTOM_SHEET_MEAL_FEEDBACK.NOT_REQUESTED;

  return FEEDBACK_ALIASES[feedback] ?? BOTTOM_SHEET_MEAL_FEEDBACK.DONE;
};

const toImageSource = (source) => {
  if (!source) return null;
  return typeof source === "string" ? { uri: source } : source;
};

const PhotoStrip = ({ photos }) => {
  const photoSlots = photos.filter(Boolean);

  if (photoSlots.length === 0) return null;

  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      directionalLockEnabled
      alwaysBounceHorizontal={false}
      showsHorizontalScrollIndicator
      className="w-full"
      contentContainerStyle={{ gap: 10 }}
    >
      {photoSlots.map((photo, index) => (
        <Image
          key={index}
          source={toImageSource(photo)}
          resizeMode="cover"
          className="shrink-0 rounded-[6px]"
          style={{ width: 120, height: 120 }}
        />
      ))}
    </ScrollView>
  );
};

const FeedbackSection = ({
  feedback,
  trainerName,
  trainerProfileSource,
  trainerFeedback,
  feedbackTime,
}) => {
  if (feedback === BOTTOM_SHEET_MEAL_FEEDBACK.TRAINER_NONE) return null;

  if (feedback === BOTTOM_SHEET_MEAL_FEEDBACK.NOT_REQUESTED) {
    return (
      <View className="w-full border-t border-grayscale-G100 pt-5">
        <Text className="text-14 font-pretendard-regular text-grayscale-G500">
          이 식사는 피드백을 요청하지 않았습니다.
        </Text>
      </View>
    );
  }

  const isWaiting = feedback === BOTTOM_SHEET_MEAL_FEEDBACK.WAITING;
  const profileSource = toImageSource(trainerProfileSource);

  return (
    <View className="w-full flex-row items-start gap-4 border-t border-grayscale-G100 pt-5">
      {profileSource ? (
        <Image
          source={profileSource}
          resizeMode="cover"
          className="h-12 w-12 rounded-full"
        />
      ) : (
        <View className="h-12 w-12 rounded-full bg-grayscale-G100" />
      )}

      <View className="min-w-0 flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="text-14 font-pretendard-semibold text-text"
          >
            {trainerName}
          </Text>
          <Text className="text-12 font-pretendard-regular text-grayscale-G500">
            {isWaiting ? "대기 중" : feedbackTime}
          </Text>
        </View>

        <Text
          className={`text-14 font-pretendard-regular ${
            isWaiting ? "text-grayscale-G500" : "text-text"
          }`}
        >
          {isWaiting
            ? "트레이너가 식사 내용을 확인 중입니다."
            : trainerFeedback}
        </Text>
      </View>
    </View>
  );
};

const BottomSheetMeal = ({
  date = "2026년 5월 25일 (수)",
  title = "제목",
  time = "14:30",
  mealContent = "식사 내용이 여기에 표시됩니다.",
  feedback = BOTTOM_SHEET_MEAL_FEEDBACK.DONE,
  trainerName = "김민수 트레이너",
  trainerFeedback = "피드백 내용",
  feedbackTime = "3시간 전",
  trainerProfileSource,
  photos = DEFAULT_PHOTO_SLOTS,
  photo = true,
  hasPhotos,
  detail = true,
  hasMealContent,
  datail,
  onEdit,
  onDelete,
  onClose,
  className = "",
  visible = true,
  minHeight = 340,
  initialHeight = 522,
  maxHeight,
  draggable = true,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const bottomSheetRef = useRef(null);
  const normalizedFeedback = normalizeFeedback(feedback);
  const shouldShowPhoto = hasPhotos ?? photo;
  const shouldShowDetail = hasMealContent ?? datail ?? detail;
  const canEdit = normalizedFeedback !== BOTTOM_SHEET_MEAL_FEEDBACK.DONE;
  const resolvedMaxHeight = Math.min(
    maxHeight ?? windowHeight * 0.9,
    windowHeight * 0.9,
  );
  const resolvedMinHeight = Math.min(minHeight, resolvedMaxHeight);
  const resolvedInitialHeight = Math.min(
    Math.max(initialHeight, resolvedMinHeight),
    resolvedMaxHeight,
  );
  const snapPoints = useMemo(
    () => [resolvedMinHeight, resolvedInitialHeight, resolvedMaxHeight],
    [resolvedInitialHeight, resolvedMaxHeight, resolvedMinHeight],
  );

  if (!visible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      animateOnMount
      enablePanDownToClose
      enableHandlePanningGesture={draggable}
      enableContentPanningGesture={draggable}
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{
        width: 60,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E7E7E7",
      }}
      style={{ width: "100%" }}
      containerStyle={{ zIndex: 10 }}
    >
      <BottomSheetScrollView
        className={`w-full ${className}`}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          gap: 20,
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <View className="w-full gap-4">
          <View className="w-full gap-2">
            <Text className="text-12 font-pretendard-regular text-grayscale-G700">
              {date}
            </Text>

            <View className="w-full gap-1">
              <Text
                numberOfLines={1}
                className="w-full text-18 font-pretendard-bold text-text"
              >
                {title}
              </Text>
              <Text className="w-full text-14 font-pretendard-regular text-grayscale-G700">
                {time}
              </Text>
            </View>
          </View>

          {shouldShowPhoto ? <PhotoStrip photos={photos} /> : null}

          {shouldShowDetail && mealContent ? (
            <View className="w-full gap-1">
              <Text className="text-14 font-pretendard-semibold text-text">
                식사 내용
              </Text>
              <Text className="text-14 font-pretendard-regular text-text">
                {mealContent}
              </Text>
            </View>
          ) : null}
        </View>

        <FeedbackSection
          feedback={normalizedFeedback}
          trainerName={trainerName}
          trainerProfileSource={trainerProfileSource}
          trainerFeedback={trainerFeedback}
          feedbackTime={feedbackTime}
        />

        <View className="w-full flex-row items-center gap-4">
          <View className="flex-1">
            <Button
              text="수정"
              variant={canEdit ? "weak" : "disabled"}
              disabled={!canEdit}
              onPress={onEdit}
            />
          </View>
          <View className="flex-1">
            <Button text="삭제" variant="weakDark" onPress={onDelete} />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default BottomSheetMeal;
