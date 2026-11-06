// 미처리 식단 피드백 화면 확인용 목업입니다. API 연동 시 회원별 조회 결과로 교체합니다.
const LONG_MEAL_TITLE =
  "그러려던게 아니고 정말 친한 10년지기 친구가 결혼해서 결혼식 뷔페";
const MEAL_PHOTO = require("@/assets/images/meal-feedback-sample/grilled-meal.png");

export const trainerMealFeedbackMembers = [
  {
    id: "member-yuna",
    name: "노유나",
    meals: [
      {
        id: "meal-yuna-breakfast",
        title: "아침",
        time: "11:30",
        feedback: "waiting",
        thumbnailSource: MEAL_PHOTO,
      },
      {
        id: "meal-yuna-buffet",
        title: LONG_MEAL_TITLE,
        time: "11:30",
        feedback: "waiting",
      },
    ],
  },
  {
    id: "member-jiwoo",
    name: "이지우",
    meals: [
      {
        id: "meal-jiwoo-breakfast",
        title: "아침",
        time: "11:30",
        feedback: "waiting",
        thumbnailSource: MEAL_PHOTO,
      },
      {
        id: "meal-jiwoo-buffet-1",
        title: LONG_MEAL_TITLE,
        time: "11:30",
        feedback: "waiting",
      },
      {
        id: "meal-jiwoo-buffet-2",
        title: LONG_MEAL_TITLE,
        time: "11:30",
        feedback: "waiting",
      },
    ],
  },
];
