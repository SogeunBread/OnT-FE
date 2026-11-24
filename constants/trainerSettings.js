// Figma examples only. Replace these values with the authenticated account/API adapter.
export const trainerSettingsAccount = {
  name: "홍길동",
  birthDate: "1997-12-21",
  phone: "010-1234-5678",
  gender: "male",
  avatarSource: null,
  loginProvider: "kakao",
};

export const trainerNotificationDefaults = {
  push: false,
  meal: false,
  chat: false,
  schedule: false,
  night: false,
};

export const trainerNotificationOptions = [
  { key: "push", title: "푸시 알림", subtitle: "리마인드, 이벤트, 트레이너 정보를 빠르게 알려드릴게요!" },
  { key: "meal", title: "식단 피드백", subtitle: "트레이너에게 식단 피드백을 받으면 알려드릴게요!" },
  { key: "chat", title: "채팅 및 매칭", subtitle: "채팅 및 매칭 만료, 수락, 거절 등을 알려드릴게요!" },
  { key: "schedule", title: "운동 일지 및 일정", subtitle: "운동 일지 작성 및 PT 일정을 알려드릴게요!" },
  { key: "night", title: "야간 알림", subtitle: "오후 9시 ~ 오전 6시에도 알림을 전송해드릴게요!" },
];

// Historical members are display-only: profile lookup is deferred in Figma annotations.
export const trainerPastPtRecords = [
  { id: "past-1", name: "이종범", startDate: "2023.10.05", endDate: "2024.02.04", lessonCount: 20 },
  { id: "past-2", name: "김수현", startDate: "2023.09.01", endDate: "2023.12.31", lessonCount: 5 },
  { id: "past-3", name: "박지민", startDate: "2023.11.10", endDate: "2024.03.10", lessonCount: 10 },
  { id: "past-4", name: "최민호", startDate: "2023.08.15", endDate: "2023.11.14", lessonCount: 15 },
  { id: "past-5", name: "이서연", startDate: "2023.07.20", endDate: "2023.10.19", lessonCount: 25 },
  { id: "past-6", name: "정다은", startDate: "2023.12.01", endDate: "2024.03.31", lessonCount: 30 },
  { id: "past-7", name: "한지훈", startDate: "2023.06.05", endDate: "2023.09.03", lessonCount: 20 },
];
