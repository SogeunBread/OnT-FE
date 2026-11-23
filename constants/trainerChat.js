// Figma 확인용 목업. API 연동 시 이 데이터와 TrainerChatProvider의 메모리 상태를 교체합니다.
const request = {
  gymName: "다짐 헬스장",
  trainerName: "김재민 트레이너",
  lessonCount: 10,
  purpose: "꾸준한 관리용",
  detailPurpose: "기본 자세 정확히 배우기 외 3개",
  experience: "헬스를 해본 경험이 있어요.",
  regions: ["와동동", "운정1동", "운정2동", "동패동", "목동동"],
  preferredTrainer: "남성・30대",
  note: "헬스를 처음 해봐서 꼼꼼히 트레이닝 받고 싶어요",
};

const member = { gender: "남자", age: 28, totalPT: 20, completedPT: 8, progress: 39.7 };
const text = (id, value, writer, time, date = "2026-04-20") => ({
  id, kind: "text", text: value, writer, time, date,
});

const memberMessages = [
  text("m1", "회원님 오늘 했던 스쿼트 자세 기억하세요!! 내일 검사합니다", "you", "16:49", "2026-04-19"),
  text("m2", "넵.. ㅠ", "you", "17:58", "2026-04-19"),
  text("m3", "선생님 혹시 오늘 피티 3시였나요 저는 왜 2시 반인줄 알았죠...?", "you", "14:35"),
  text("m4", "원래 세시였어요 ㅋㅋ 맨날 3시에 하잖아요", "me", "14:37"),
  text("m5", "유산소나 뛰고 계세요 지금 가는중", "me", "14:37"),
  text("m6", "회원님 오늘 수고하셨어요!", "me", "16:32"),
  text("m7", "넵!! 수고하셨어용", "you", "16:32"),
  { id: "m8", kind: "photo", writer: "me", time: "09:22", date: "2026-04-21", imageSource: require("../assets/figma/chat-example-workout.png"), imageAspectRatio: 200 / 134 },
  text("m9", "잘뛴다!! ㅋㅋ", "me", "09:23", "2026-04-21"),
  text("m10", "오메나 언제오셨대;;", "you", "09:25", "2026-04-21"),
];

const consultationMessages = [
  { id: "request", kind: "request", date: "2026-04-20" },
  text("c1", "그럼 PT 같이 해보면 좋을 거 같아요!!", "you", "14:35"),
  text("c2", "오오 좋습니다 그럼 헬스장 오셔서 한번 계약서 쓰실래요??", "me", "14:37"),
  text("c3", "앗 가격은 10번에 40만원이고 첫달은 헬스장 한달권까지 같이 드리고 있어여", "me", "14:37"),
  text("c4", "넵!!", "you", "16:32"),
  text("c5", "언제쯤 오실 수 있으세요?", "me", "14:37"),
  text("c6", "제가 다른 헬스장도 하고 있어서 미리 약속 잡아봐용", "me", "14:37"),
  text("c7", "저 오늘 저녁에 갈게요!", "you", "16:32"),
  text("c8", "오늘 가면 입금도 드려야 하죠?", "you", "16:32"),
  text("c9", "넵 그럼 좋죠 ㅎㅎ", "me", "14:37"),
  text("c10", "오늘 저녁에 오시면 헬스장 소개랑 간단하게 인바디도 재볼게요!", "me", "14:37"),
];

export const trainerChatRooms = [
  ["member-jongbeom", "이종범", "오메나 언제 오셨대;;", "16:34", 1],
  ["member-eunji", "이은지", "저 오늘 퇴근하고 운동할건데 선생님 계시나용?", "15:22", 3],
  ["member-ayoung", "김아영", "선생님 혹시 저번 피티때 마지막에 했던 운동 주의할 점이 머엿죠?", "15:01", 1],
  ["member-chaewon", "김채원", "저 오늘 유산소 평소보다 20분이나 더 뛰었어요!!!", "13:43", 1],
  ["member-yunchae", "정윤채", "저 오늘 식단도 다 했고 운동도 개인운동했습니당!!", "8/30", 1],
  ["member-sunghoon", "박성훈", "넵!! 감사합니다", "8/29", 0],
  ["member-sunwoo", "김선우", "다음 수업때 뵐게요!!", "8/29", 0],
  ["member-yujin", "안유진", "식단 올려두었습니당", "8/29", 0],
].map(([id, memberName, message, time, unreadCount], index) => ({
  id, memberName, message, time, unreadCount, category: "member", member: { ...member },
  messages: index === 0 ? memberMessages : [text(`${id}-last`, message, "you", time, "2026-04-21")],
})).concat([
  ["consultation-sunghoon", "박성훈", "넵!! 감사합니다"],
  ["consultation-sunwoo", "김선우", "넵 ㅠㅠ"],
  ["consultation-yujin", "안유진", "알겠습니당"],
].map(([id, memberName, message]) => ({
  id, memberName, message, time: "8/29", unreadCount: 0, category: "consultation",
  request: { ...request }, requestStatus: "pending", messages: [...consultationMessages],
})));

export const previewMemberRoom = trainerChatRooms[0];
export const previewConsultationRoom = {
  ...trainerChatRooms[8], id: "preview-noyuna", memberName: "노유나",
};

// 수락 직후 상세 화면의 초기 목업. 실제 회차/회원 정보는 서버 계약으로 교체해야 합니다.
export function createMatchedMember(lessonCount) {
  return { gender: "미입력", age: null, totalPT: lessonCount, completedPT: 0, progress: 0 };
}
