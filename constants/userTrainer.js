// Figma examples for UI only. Replace at UserTrainerProvider when API contracts exist.
import { trainerChatRooms } from "./trainerChat";
import { createExerciseSeed } from "../features/exercise/mockData";

export const userTrainerProfile = {
  name: "김재민 트레이너", gender: "남자", age: 28,
  specialties: ["다이어트", "재활운동", "체력향상", "바디프로필", "임산부PT"],
  progress: 39.7, totalPT: 20, completedPT: 8,
  gymName: "다짐 오류동역점", address: "서울특별시 구로구 오류동 123-45",
};
export const userTrainerLesson = {
  ...createExerciseSeed(new Date(2026, 3, 13)).sessions[0],
  id: "user-trainer-lesson", trainerName: "김재민 트레이너", date: "2026-04-13",
  sessionNumber: 4, totalSessions: 20,
};
export const requestAnswers = {
  ptType: "steady", goal: ["learnPosture", "improveFitness", "shortTermBodyChange", "feedback"],
  experience: "triedGym", lessonCount: "10",
  location: ["와동동", "운정1동", "운정2동", "동패동", "목동동"].map((title, index) => ({ id: `sample-${index}`, title })),
  trainerPreference: { gender: "male", age: "30s" }, memo: "헬스를 처음 해봐서 꼼꼼히 트레이닝 받고 싶어요",
};
export const sampleUserRequest = {
  id: "request-original", gymName: "다짐 헬스장", trainerName: userTrainerProfile.name,
  lessonCount: 10, purpose: "꾸준한 관리용", detailPurpose: "기본 자세 정확히 배우기 외 3개",
  experience: "헬스를 해본 경험이 있어요.", regions: requestAnswers.location.map((item) => item.title),
  preferredTrainer: "남성・30대", note: requestAnswers.memo, answers: requestAnswers,
  status: "pending", sentAt: "2026-04-20T14:35:00+09:00",
};
export const userChatImages = {
  workout: require("../assets/figma/chat-example-workout.png"),
  pizza: require("../assets/figma/user-chat-example-pizza.jpg"),
};
const text = (id, value, writer = "me", time = "09:25", date = "2026-04-21") => ({ id, text: value, writer, time, date, kind: "text" });
export const userChatBaseMessages = trainerChatRooms[0].messages.map((item) => ({
  ...item, writer: item.id === "m1" ? "you" : item.id === "m2" ? "me" : item.writer === "me" ? "you" : "me",
}));
const sentText = text("sent-text", "슨생님 저 오늘 피자 먹어도 돼요..?");
const sentPhoto = { id: "sent-photo", kind: "photo", writer: "me", date: "2026-04-21", time: "09:25", imageSource: userChatImages.pizza, imageAspectRatio: 390 / 259 };
export const userChatConsultation = trainerChatRooms[8].messages.filter((item) => item.kind === "text").map((item) => ({
  ...item, writer: item.writer === "me" ? "you" : "me",
}));
export const mealMessage = { id: "meal-request", kind: "meal", writer: "me", date: "2026-04-21", time: "10:23", mealId: "user-trainer-meal-1", mealDate: "2026년 4월 21일 (금) 10:00", photoCount: 2 };
export const feedbackMessages = ["2026년 4월 21일 (금) 18:40", "2026년 4월 22일 (금) 14:00", "2026년 4월 22일 (금) 18:00"].map((mealDate, i) => ({
  id: `feedback-${i}`, kind: "feedback", writer: "you", date: "2026-04-22", time: "19:03", mealId: ["user-trainer-meal-4", "user-trainer-meal-2", "user-trainer-meal-3"][i], mealDate,
}));
export const ptMessages = ["create", "update", "delete"].map((variant, i) => ({
  id: `pt-${variant}`, kind: `pt-${variant}`, writer: "you", date: `2026-04-${String([8, 10, 11][i]).padStart(2, "0")}`, time: "14:26",
  sessionId: "user-trainer-lesson", lesson: "4회차", lessonTime: variant === "create" ? "4월 13일 15:00-16:00" : "4월 14일 15:00-16:00", previousTime: "4월 13일 15:00-16:00",
}));
export const userTrainerScenarios = [
  ["53:5683", "매칭된 트레이너", "current"], ["53:5746", "예정 수업 없음", "no-lesson"],
  ["53:4658", "이전 채팅", "previous"], ["53:4677", "매칭 트레이너 없음", "unmatched"], ["53:4693", "특수 메시지 미리보기", "special-list"],
  ["53:5467", "채팅 초기", "initial"], ["53:5612", "요청서 확인", "request"], ["53:5190", "시트 내부 스크롤", "long-request"],
  ["53:5268", "취소 확인", "cancel-dialog"], ["53:5538", "요청 취소", "cancelled"], ["53:5573", "취소 후 대화", "after-cancel"],
  ["53:5385", "재요청·수락", "accepted"], ["53:5499", "요청 거절", "rejected"], ["53:5348", "72시간 만료", "expired"],
  ["53:4721", "PT 채팅", "chat"], ["53:4865", "텍스트 입력", "typing"], ["53:4901", "전송 성공", "sent"],
  ["53:5183", "사진 전송 전 확인", "photo-preview"], ["53:4941", "사진 전송", "photo"], ["53:4983", "마지막 메시지 시각", "grouped"],
  ["53:5026", "식단 전송", "meal"], ["53:5077", "피드백", "feedback"], ["53:5129", "피드백 여러 건", "feedback-many"],
  ["53:4756", "PT 일정 등록", "pt-create"], ["53:4789", "PT 일정 수정", "pt-update"], ["53:4821", "PT 일정 취소", "pt-delete"],
];
const clone = (value) => JSON.parse(JSON.stringify(value));
export function createUserTrainerSeed() {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const active = { id: "jaemin", trainer: userTrainerProfile, matched: true, unreadCount: 0,
    requests: [{ ...sampleUserRequest, status: "accepted" }], messages: clone(userChatBaseMessages), upcoming: true };
  const rooms = [active, ...[
    ["minji", "김민지 트레이너", "넵 ㅎㅎ 그럼 다음에 연락주세요!!", "16:34", 0],
    ["chanmi", "김찬미 트레이너", "아아 그럼 피티 하실 생각 있으면 나중에 다시 한번 연락주세요!!", "10:23", 1],
    ["junsu", "문준수 트레이너", "보통 주 2회 정도는 해요 ㅋㅋ", "8/21", 0],
    ["seungheon", "백승헌 트레이너", "평일 저녁은 제가 지금 수업이 풀수업이라 어려울거 같네여 ㅠ", "8/20", 0],
  ].map(([id, name, value, time, unreadCount], i) => ({ id, trainer: { ...userTrainerProfile, name }, matched: false, unreadCount,
    requests: [{ ...clone(sampleUserRequest), trainerName: name, status: "pending", sentAt: now.toISOString() }],
    messages: [...clone(userChatConsultation), text(`${id}-last`, value, "you", i < 2 ? time : "10:00", i < 2 ? date : `2026-08-${i === 2 ? 21 : 20}`)] }))];
  return { rooms, selectedTab: "current", drafts: {} };
}
export function scenarioSeed(key) {
  const seed = createUserTrainerSeed();
  const room = seed.rooms[0];
  room.requests = [{ ...clone(sampleUserRequest), status: "accepted" }];
  if (["previous", "unmatched"].includes(key)) {
    seed.selectedTab = "previous";
    if (key === "unmatched") seed.rooms = seed.rooms.slice(1);
  }
  if (key === "special-list") {
    seed.rooms = ["request", "cancelled", "expired", "rejected", "accepted", "pt-create", "pt-update", "pt-delete"].map((kind, i) => ({
      ...clone(room), id: `special-${i}`, matched: false, trainer: { ...room.trainer, name: ["김민지 트레이너", "김찬미 트레이너", "문준수 트레이너"][i] ?? "백승헌 트레이너" },
      messages: [{ id: `special-${i}`, kind, date: "2026-08-20", time: "16:34", requestId: sampleUserRequest.id, ...ptMessages.find((item) => item.kind === kind) }],
    }));
  }
  if (key === "no-lesson") room.upcoming = false;
  if (["initial", "request", "long-request", "cancel-dialog", "cancelled", "after-cancel", "rejected", "expired", "accepted"].includes(key)) {
    room.matched = false;
    room.requests[0].status = ["cancelled", "after-cancel"].includes(key) ? "cancelled" : ["rejected", "expired", "accepted"].includes(key) ? key : "pending";
    room.messages = key === "initial" ? [{ id: "request", kind: "request", date: "2026-04-20", requestId: sampleUserRequest.id }] : clone(userChatConsultation);
    if (key === "long-request" || key === "cancel-dialog") room.requests[0].regions = ["고양시 전체", "김포시 전체", "동패동", "목동동", "연다산동"];
    if (key === "long-request" || key === "cancel-dialog") room.requests[0].note = "헬스를 처음 해봐서 꼼꼼히 트레이닝 받고 싶어요. 어느정도로 꼼꼼히 받고 싶냐면 운동 시작할 때 스트레칭하거나 운동할 때 세트? 몇 개씩 해야 하는지 그런거요... 운동을 살면서 한번도 안해봤거든요...";
    if (["cancelled", "after-cancel", "rejected", "expired", "accepted"].includes(key)) room.messages.push({ id: "outcome", kind: key === "after-cancel" ? "cancelled" : key, date: "2026-04-20", requestId: sampleUserRequest.id, reason: "현재 신규 회원을 받고 있지 않습니다" });
    if (key === "after-cancel") room.messages.push(text("cancel-reply", "헐 왜 취소하셨어요..ㅠㅠ", "you", "15:03"), text("cancel-answer", "헐 잘못눌렀어요 다시 신청할게요 ㅠㅠ"));
    if (key === "rejected") room.messages.splice(-1, 0,
      text("reject-reply-1", "아.. 현지님 죄송한데 제가 회원 수가 꽉찼네요 ㅠㅠ", "you", "14:37", "2026-04-20"),
      text("reject-reply-2", "죄송하지만 매칭 거절할게요.", "you", "14:37", "2026-04-20"));
    if (key === "accepted") {
      room.matched = true;
      room.requests = [{ ...clone(sampleUserRequest), status: "cancelled" }, { ...clone(sampleUserRequest), id: "request-second", status: "accepted" }];
      room.messages = [...clone(userChatConsultation),
        { id: "cancel-first", kind: "cancelled", date: "2026-04-20", requestId: sampleUserRequest.id },
        text("why-cancel", "헐 왜 취소하셨어요..ㅠㅠ", "you", "15:03", "2026-04-20"),
        text("new-request-1", "헐 잘못눌렀어요 다시 신청할게요 ㅠㅠ", "me", "16:32", "2026-04-20"),
        text("new-request-2", "죄송해여 ㅜㅜ 바로 보내겠습니당", "me", "16:32", "2026-04-20"),
        { id: "request-second-message", kind: "request", date: "2026-04-20", requestId: "request-second" },
        { id: "accepted-second", kind: "accepted", date: "2026-04-20", requestId: "request-second" }];
    }
  }
  if (key === "typing") seed.drafts.jaemin = sentText.text;
  if (["sent", "photo", "grouped", "meal", "feedback", "feedback-many"].includes(key)) room.messages.push(clone(sentText));
  if (["photo", "grouped", "meal", "feedback", "feedback-many"].includes(key)) room.messages.push(clone(sentPhoto));
  if (["grouped", "meal", "feedback", "feedback-many"].includes(key)) room.messages.push(text("already-ate", "사실 이미 먹음 ㅋㅋ"));
  if (["meal", "feedback", "feedback-many"].includes(key)) room.messages.push(text("coach-reply", "장난하나 설마 콜라도 그냥 콜라 먹은거 아니죠", "you", "09:42"), text("meal-reply", "어케 알았쥐 ㅋㅋ 치팅데이 좀 봐주세요", "me", "10:23"), clone(mealMessage));
  if (key === "feedback") room.messages.push({ ...clone(feedbackMessages[0]), mealDate: mealMessage.mealDate, mealId: mealMessage.mealId, date: "2026-04-21" }, text("coach-end", "오늘 피티 두고보자", "you", "10:23"));
  if (key === "feedback-many") room.messages.push(...clone(feedbackMessages), text("coach-end", "ㅈㅅㅈㅅ 좀 바빴어요", "you", "19:03", "2026-04-22"));
  if (key.startsWith("pt-")) {
    room.messages.push(
      text("schedule-question", "회원님 이번주 피티 평소처럼 금요일 네시로 할까요?", "you", "14:23", "2026-04-08"),
      text("schedule-answer", "넵!!", "me", "14:25", "2026-04-08"), clone(ptMessages[0]),
      text("schedule-coach", "저번 피티때 말했던 거처럼 이번에는 하체 위주로 진행해볼게여", "you", "14:26", "2026-04-08"));
    if (key !== "pt-create") room.messages.push(
      text("schedule-edit-q", "선생님 혹시 제가 금요일에 알바 면접이 잡혀서 토요일로 바꿀 수 있을까요?", "me", "14:25", "2026-04-10"),
      text("schedule-edit-q2", "시간은 아무때나 좋아요!", "me", "14:25", "2026-04-10"),
      text("schedule-edit-a", "아 넵!", "you", "14:26", "2026-04-10"), clone(ptMessages[1]),
      text("schedule-edit-a2", "시간은 그대로 해서 수정해뒀어요!", "you", "14:26", "2026-04-10"));
    if (key === "pt-delete") room.messages.push(
      text("schedule-cancel-q", "회원님 진짜 죄송한데 이번 회차 일정 다시 잡아봐도 될까요?", "you", "14:26", "2026-04-11"),
      text("schedule-cancel-q2", "제가 토요일에 결혼식이 있었던걸 잊고 있었어요..", "you", "14:26", "2026-04-11"),
      text("schedule-cancel-a", "아 넵넵!! ㅎㅎ", "me", "14:25", "2026-04-11"),
      text("schedule-cancel-a2", "다음주에 다시 이야기 해봐용 저 그냥 개인운동할게요", "me", "14:25", "2026-04-11"), clone(ptMessages[2]),
      text("schedule-cancel-end", "넵 ㅠㅠ 감사해요", "you", "14:26", "2026-04-11"));
  }
  return seed;
}
