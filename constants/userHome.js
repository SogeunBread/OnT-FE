import { trainerProfileExample, trainerProfileInitial } from "./trainerProfile";
export const homePurposes = ["다이어트", "체형교정", "근력강화", "재활운동", "체력향상", "바디프로필", "그룹PT", "임산부PT", "집중운동", "크로스핏", "맨몸운동", "식단관리", "자세교정", "통증관리"];
// Explicit mock product prices and comparison amounts; no inferred server pricing rule.
const profile = (id, name, gym, gender, age, rating, reviewCount, price, specialties, extra = {}) => ({
  ...trainerProfileExample, id, name, gender, age, rating, reviewCount, specialties,
  introduction: trainerProfileExample.introduction.replaceAll("김재민", name),
  location: { name: gym, address: "서울특별시 구로구 오류동 123-45" },
  regionIds: ["seoul", "seoul-all", "oryu", "guro", "gyeonggi", "paju", "paju-all", "geomsan", "gyoha"],
  prices: [{ id: `${id}-1`, count: 1, price: String(Math.round(price / 10)), benefit: "" }, { id: `${id}-10`, count: 10, price: String(price), benefit: "3개월 이용권 증정" }, { id: `${id}-20`, count: 20, price: String(price * 2 - 50000), benefit: "6개월 이용권 증정" }],
  comparisonPrice: Math.round(price / 10), careerLabel: "5년 3개월", certificateCount: 4, ...extra,
});
export const discoveryTrainers = [
  profile("jaemin", "김재민", "다짐 오류동역점", "남자", 29, 5, 1239, 450000, trainerProfileExample.specialties, { prices: trainerProfileExample.prices }),
  profile("minha", "김민하", "멋핏 신도림", "여자", 34, 4.6, 48, 400000, ["체형교정", "근력강화", "집중운동"]),
  profile("jahyeong", "박제형", "온짐 헬스장 개봉역", "남자", 27, 4.9, 93, 499000, []),
  profile("minju", "이민주", "미소피트니스", "여자", 38, 4.8, 202, 485000, ["맨몸운동", "자세교정"]),
  profile("oryu", "김오류", "리턴짐 운정점", "남자", 31, 5, 1239, 450000, ["재활운동", "체력향상", "임산부PT"], { searchOnly: true }),
  profile("nayeon", "김나연", "다짐 헬스장", "여자", 29, 4.9, 128, 400000, ["근력강화", "바디프로필", "식단관리"], { listVisible: false, careerLabel: "1년 9개월", certificateCount: 3 }),
  profile("jiwu", "최지우", "다짐 헬스장", "여자", 30, 4.9, 128, 500000, trainerProfileExample.specialties, { listVisible: false, careerLabel: "1년 1개월", certificateCount: 6 }),
];
export const homeScenarios = [
 ["57:8680", "홈 · 기록 있음", "home"], ["57:8750", "홈 · 미매칭/빈 기록", "home-empty"],
 ["57:8821", "트레이너 목록", "list"], ["57:8671", "이름/헬스장 검색", "search"], ["57:8833", "필터 적용", "applied"],
 ["57:8847", "필터", "filter"], ["57:8911", "횟수/가격 조절", "range"],
 ["57:8027", "지역 초기", "regions"], ["57:8072", "지역 선택", "regions-selected"], ["57:8975", "지역 검색", "region-search"],
 ["57:8126", "트레이너 프로필", "profile"], ["57:8652", "프로필 정보 없음", "profile-empty"], ["57:8219", "리뷰", "reviews"],
 ["57:8460", "비교함 초기", "compare-empty"], ["57:8365", "비교함 1명", "compare-one"], ["57:8538", "비교함 2명", "compare-two"], ["57:8233", "비교함 3명", "compare-three"],
];
export const memberProfileExample = { ...trainerProfileExample, id: "jaemin", comparisonPrice: 45000, careerLabel: "5년 3개월", certificateCount: 4 };
export const memberProfileEmpty = { ...trainerProfileInitial, id: "empty", regionIds: [], comparisonPrice: null, careerLabel: "-", certificateCount: 0 };
