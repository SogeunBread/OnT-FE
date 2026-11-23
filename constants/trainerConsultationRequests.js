// API 연동 전, 매칭 폼과 첫 채팅으로 접수된 신규 상담 요청을 확인하는 목업입니다.
// 요청 상태 변경이나 읽음 처리는 서버 명세에 맞춰 후속으로 연결합니다.
const REQUEST_MESSAGE =
  "PT 수업 요청이 전송됐어요! 트레이너가 요청을 확인한 후 수락 여부를 결정해요.";

export const trainerConsultationRequests = [
  {
    id: "consultation-sunghoon",
    memberName: "박성훈",
    message: REQUEST_MESSAGE,
    time: "8/29",
    unreadCount: 1,
  },
  {
    id: "consultation-sunwoo",
    memberName: "김선우",
    message: REQUEST_MESSAGE,
    time: "8/29",
    unreadCount: 1,
  },
  {
    id: "consultation-yujin",
    memberName: "안유진",
    message: REQUEST_MESSAGE,
    time: "8/29",
    unreadCount: 1,
  },
];
