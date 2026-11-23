import { MEAL_CARD_FEEDBACK } from "@/components/meal_card/MealCard";
import { format } from "date-fns";
import { Image } from "react-native";

const PHOTO_SOURCES = [
  require("@/assets/images/meal-feedback-sample/grilled-meal.png"),
  require("@/assets/images/meal-feedback-sample/vegetables.png"),
  require("@/assets/images/meal-feedback-sample/ice-cream.png"),
  require("@/assets/images/meal-feedback-sample/dumplings.png"),
];

const toSamplePhoto = (source, id) => ({
  ...(typeof source === "number" ? Image.resolveAssetSource(source) : source),
  id,
});

export function createFeedbackMealSample() {
  return {
    id: "meal-feedback-sample",
    date: format(new Date(), "yyyy-MM-dd"),
    title: "아침",
    time: "11:30",
    mealContent: "바나나랑 단백질쉐이크 먹고 끝내려했는데 너무 배고파서 초코파이 하나를 먹어버렸습니다 흑흑",
    photos: PHOTO_SOURCES.map((source, index) => toSamplePhoto(source, `meal-feedback-sample-photo-${index + 1}`)),
    hasMatchedTrainer: true,
    feedbackRequested: true,
    feedback: MEAL_CARD_FEEDBACK.DONE,
    trainerName: "김민수 트레이너",
    trainerFeedback: "아니 이 고칼로리 고지방 꼬치들 뭡니까? 이런 걸 먹고 살을 어케 빼욧!! 당장 헬스장으로 와서 유산소 3시간 조지고 가세요!!",
    feedbackTime: "3시간 전",
  };
}

export function createWaitingMealSample() {
  return {
    id: "meal-waiting-sample",
    date: format(new Date(), "yyyy-MM-dd"),
    title: "그러려던게 아니고 정말 친한 10년지기 친구가 결혼해서 결혼식 뷔페",
    time: "13:00",
    mealContent: "",
    photos: [],
    hasMatchedTrainer: true,
    feedbackRequested: true,
    feedback: MEAL_CARD_FEEDBACK.WAITING,
    trainerName: "김민수 트레이너",
  };
}

export function createNotRequestedMealSample() {
  return {
    id: "meal-not-requested-sample",
    date: format(new Date(), "yyyy-MM-dd"),
    title: "안 먹으려고 했는데 부모님이 입으로 넣어버려서 어쩔 수 없이 먹은 저녁",
    time: "18:00",
    mealContent: "",
    photos: [toSamplePhoto(require("@/assets/images/meal-feedback-sample/salmon.jpg"), "meal-not-requested-sample-photo-1")],
    hasMatchedTrainer: true,
    feedbackRequested: false,
    feedback: MEAL_CARD_FEEDBACK.NOT_REQUESTED,
    trainerName: "김민수 트레이너",
  };
}

export function createNoTrainerMealSample() {
  return {
    id: "meal-no-trainer-sample",
    date: format(new Date(), "yyyy-MM-dd"),
    title: "야식",
    time: "22:00",
    mealContent: "트레이너 업는데 뭐. 먹어도 되잖아. 안돼?",
    photos: [],
    hasMatchedTrainer: false,
    feedbackRequested: false,
    feedback: MEAL_CARD_FEEDBACK.NONE,
  };
}
