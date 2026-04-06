import { Image, Pressable, Text, View } from "react-native";

export const MEAL_CARD_FEEDBACK = Object.freeze({
  WAITING: "waiting",
  DONE: "done",
  NOT_REQUESTED: "notRequested",
  NONE: "none",
});

// 외부에서 어떤 상태 문자열을 넘겨도 MealCard 내부 상태값으로 정규화한다.
const FEEDBACK_ALIASES = {
  waiting: MEAL_CARD_FEEDBACK.WAITING,
  "피드백 대기 중": MEAL_CARD_FEEDBACK.WAITING,
  done: MEAL_CARD_FEEDBACK.DONE,
  "피드백 완료": MEAL_CARD_FEEDBACK.DONE,
  false: MEAL_CARD_FEEDBACK.NOT_REQUESTED,
  notRequested: MEAL_CARD_FEEDBACK.NOT_REQUESTED,
  "피드백 미신청": MEAL_CARD_FEEDBACK.NOT_REQUESTED,
  "trainer-none": MEAL_CARD_FEEDBACK.NONE,
  none: MEAL_CARD_FEEDBACK.NONE,
  "피드백 none": MEAL_CARD_FEEDBACK.NONE,
};

// 상태마다 라벨과 스타일을 한 곳에서 관리해 렌더링 분기를 단순하게 유지한다.
const FEEDBACK_VARIANTS = {
  [MEAL_CARD_FEEDBACK.WAITING]: {
    label: "피드백 대기 중",
    badgeClassName: "bg-amber-300/30",
    dotClassName: "bg-secondary-yellow",
  },
  [MEAL_CARD_FEEDBACK.DONE]: {
    label: "피드백 완료",
    badgeClassName: "bg-blue-400/30",
    dotClassName: "bg-secondary-blue",
  },
  [MEAL_CARD_FEEDBACK.NOT_REQUESTED]: {
    label: "피드백 미신청",
    badgeClassName: "bg-grayscale-G100",
    dotClassName: "bg-grayscale-G500",
  },
};

const normalizeFeedback = (feedback) =>
  FEEDBACK_ALIASES[feedback] ?? MEAL_CARD_FEEDBACK.WAITING;

// 문자열 URL과 RN image source 객체를 모두 받을 수 있게 맞춘다.
const toImageSource = (thumbnailSource) => {
  if (!thumbnailSource) return null;
  return typeof thumbnailSource === "string"
    ? { uri: thumbnailSource }
    : thumbnailSource;
};

const MealCard = ({
  title = "아침",
  time = "11:30",
  feedback = MEAL_CARD_FEEDBACK.WAITING,
  thumbnailSource,
  className = "",
  titleClassName = "",
  timeClassName = "",
  badgeClassName = "",
  badgeTextClassName = "",
  thumbnailClassName = "",
  onPress,
  disabled = false,
  ...restProps
}) => {
  const normalizedFeedback = normalizeFeedback(feedback);
  const feedbackVariant = FEEDBACK_VARIANTS[normalizedFeedback];
  const hasBadge = normalizedFeedback !== MEAL_CARD_FEEDBACK.NONE;
  const imageSource = toImageSource(thumbnailSource);
  const hasThumbnail = Boolean(imageSource);

  return (
    <Pressable
      {...restProps}
      onPress={onPress}
      disabled={disabled || !onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className={`w-[358px] flex-row items-start rounded-lg bg-white p-3 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)] ${
        hasThumbnail ? "gap-3" : ""
      } ${className}`}
    >
      <View className={`flex-1 ${hasBadge ? "h-[72px] justify-between" : ""}`}>
        <View>
          <Text
            numberOfLines={1}
            className={`text-14 font-pretendard-semibold text-text ${titleClassName}`}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            className={`text-12 font-pretendard-regular text-grayscale-G500 ${timeClassName}`}
          >
            {time}
          </Text>
        </View>

        {hasBadge ? (
          <View
            className={`self-start rounded-full px-2 py-1 ${feedbackVariant.badgeClassName} ${badgeClassName}`}
          >
            <View className="flex-row items-center gap-2">
              {/* 상태 점 색상도 텍스트와 같이 상태 매핑에서 가져온다. */}
              <View
                className={`h-2.5 w-2.5 rounded-full ${feedbackVariant.dotClassName}`}
              />
              <Text
                className={`text-12 font-pretendard-regular text-text ${badgeTextClassName}`}
              >
                {feedbackVariant.label}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      {hasThumbnail ? (
        <Image
          source={imageSource}
          resizeMode="cover"
          // 식단 기록 사진이 연결되면 첫 번째 사진만 썸네일로 노출한다.
          className={`h-[72px] w-[72px] rounded-[6px] ${thumbnailClassName}`}
        />
      ) : null}
    </Pressable>
  );
};

export default MealCard;
