import { trainerConsultationRequests } from "./trainerConsultationRequests";
import { trainerMealFeedbackMembers } from "./trainerMealFeedback";

// API 연동 시 이 목업 대신 조회한 스케줄과 알림 개수를 전달합니다.
// 디자인과 동일한 PT 카드를 확인할 수 있도록 시작 날짜를 고정합니다.
export const TRAINER_HOME_INITIAL_DATE = "2026-04-13";

export const trainerHomeNotifications = {
  newConsultations: trainerConsultationRequests.length,
  pendingMealFeedback: trainerMealFeedbackMembers.length,
};

export const trainerHomeSchedules = [
  {
    id: "pt-20260413-yuna",
    date: "2026-04-13",
    memberName: "노유나",
    currentSession: 4,
    totalSessions: 10,
    startTime: "15:00",
    endTime: "16:00",
    location: "다짐 헬스장",
    exerciseCount: 6,
  },
  {
    id: "pt-20260413-jiwoo",
    date: "2026-04-13",
    memberName: "이지우",
    currentSession: 2,
    totalSessions: 20,
    startTime: "16:30",
    endTime: "18:00",
    location: "다짐 헬스장",
    exerciseCount: 8,
  },
  {
    id: "pt-20260415-yuna",
    date: "2026-04-15",
    memberName: "노유나",
    currentSession: 5,
    totalSessions: 10,
    startTime: "15:00",
    endTime: "16:00",
    location: "다짐 헬스장",
    exerciseCount: 6,
  },
  {
    id: "pt-20260416-jiwoo",
    date: "2026-04-16",
    memberName: "이지우",
    currentSession: 3,
    totalSessions: 20,
    startTime: "16:30",
    endTime: "18:00",
    location: "다짐 헬스장",
    exerciseCount: 8,
  },
  {
    id: "pt-20260417-yuna",
    date: "2026-04-17",
    memberName: "노유나",
    currentSession: 6,
    totalSessions: 10,
    startTime: "15:00",
    endTime: "16:00",
    location: "다짐 헬스장",
    exerciseCount: 6,
  },
];
