import { discoveryTrainers } from "./userHome";
import { trainerNotificationDefaults, trainerSettingsAccount } from "./trainerSettings";

// Local UI fixtures. Replace the seed at MemberSettingsProvider when APIs are available.
export const memberReviewPolicy = { windowDays: 90, textRequired: false, allowEdit: true, allowDelete: true };
export const reviewExampleText = "운동을 진짜 잘 알려주셔요 대회도 나가신분이라서 바디프로필 찍고싶으신분들 추천!! 운동뿐만 아니라 촬영꿀팁까지 잘 배워갑니다 ㅎㅎ";
export function createMemberSettingsSeed(now = Date.now()) {
  const daysAgo = (days) => new Date(now - days * 86400000).toISOString();
  const completed = (id, trainerId, days) => ({ id, trainerId, trainer: discoveryTrainers.find(item => item.id === trainerId), status: "ended", endedAt: daysAgo(days) });
  const histories = [completed("lesson-ended", "minju", 5), completed("lesson-expired", "nayeon", 91),
    ...["jaemin", "minha", "jahyeong", "nayeon", "jiwu"].map((id, i) => completed(`lesson-reviewed-${i}`, id, 30 + i))];
  return { account: { ...trainerSettingsAccount }, notifications: { ...trainerNotificationDefaults }, summary: { totalPT: 20, completedPT: 8 }, histories,
    reviews: histories.slice(2).map((item, i) => ({ id: `my-review-${i}`, historyId: item.id, trainerId: item.trainerId, rating: i === 3 ? 5 : 4, text: reviewExampleText, createdAt: daysAgo(20 + i), updatedAt: null })), drafts: {} };
}
export const memberSettingsScenarios = [
  ["57:10484", "내 정보 · 카카오", "home"], ["57:10513", "내 정보 · Apple", "apple"],
  ["57:10541", "내 프로필", "account"], ["57:10580", "앱 설정 · 푸시 꺼짐", "app-off"], ["57:11010", "앱 설정 · 푸시 켜짐", "app-on"],
  ["57:10999", "알림 설정 · 푸시 꺼짐", "notifications-off"], ["57:11022", "알림 설정 · 푸시 켜짐", "notifications-on"],
  ["57:10592", "수업 요청 이력 · 5개 상태", "history"], ["57:10835", "리뷰 기간 만료", "history-expired"], ["57:10714", "리뷰 작성 완료", "history-reviewed"],
  ["57:10954", "리뷰 · 입력 전", "review-empty"], ["57:10969", "리뷰 · 본문 입력", "review-text"], ["57:10984", "리뷰 · 등록 가능", "review-ready"],
  ["57:11033", "작성한 리뷰", "reviews"],
];
