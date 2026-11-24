import { Image } from "react-native";
import { MEAL_CARD_FEEDBACK } from "@/components/meal_card/MealCard";
import { userChatImages } from "./userTrainer";

// Linked examples for the meal cards. These are not server-synchronized records.
export function createUserTrainerMeals({ waiting = false } = {}) {
  const photo = (source, id) => {
    const asset = typeof source === "number" ? Image.resolveAssetSource(source) : source;
    return { id, uri: typeof asset === "string" ? asset : asset.uri };
  };
  return [
    [1, "2026-04-21", "10:00", "아침"], [2, "2026-04-22", "14:00", "점심"],
    [3, "2026-04-22", "18:00", "저녁"], [4, "2026-04-21", "18:40", "저녁"],
  ].map(([id, date, time, title]) => ({
    id: `user-trainer-meal-${id}`, date, time, title, mealContent: "사진 2장이 포함된 식단이에요.",
    photos: [photo(userChatImages.pizza, `pizza-${id}`), photo(require("../assets/images/meal-feedback-sample/grilled-meal.png"), `meal-${id}`)],
    hasMatchedTrainer: true, feedbackRequested: true,
    feedback: waiting && id === 1 ? MEAL_CARD_FEEDBACK.WAITING : MEAL_CARD_FEEDBACK.DONE,
    trainerName: "김재민 트레이너", trainerFeedback: waiting && id === 1 ? "" : "식단을 확인했어요. 다음 수업에서 함께 이야기해요.", feedbackTime: "",
  }));
}
