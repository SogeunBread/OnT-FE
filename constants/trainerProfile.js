// Figma 확인용 예시입니다. 장소/도로명 검색 API 연동 시 호출부에서 교체합니다.
export const trainerProfilePlaces = [
  { id: "unjeong", name: "다짐 운정점", address: "경기도 파주시 가람로 192 2층" },
  { id: "oryu", name: "다짐 오류동점", address: "서울특별시 구로구 오류동 123-45" },
  { id: "geumchon", name: "다짐피트니스 파주금촌점", address: "경기도 파주시 평화로 12" },
  { id: "study-cafe", name: "다짐 스터디카페 운정신도시점", address: "경기도 파주시 교하로 34 4층" },
];

export const trainerProfileAddresses = [
  { id: "gyeongin", address: "서울특별시 구로구 경인로 524" },
  { id: "garam", address: "경기도 파주시 가람로 192" },
];

// API 연결 전 로컬 세션의 초기값. 실제 로그인한 트레이너 데이터로 교체합니다.
export const trainerProfileInitial = {
  name: "김재민", gender: "남자", age: 29, verified: true,
  avatarSource: null, rating: 0, reviewCount: 0, reviews: [],
  specialties: [], introduction: "", location: null,
  prices: [], careers: [], certificates: [],
};

// 완성/리뷰 디자인을 확인하기 위한 예시이며 실제 회원 데이터가 아닙니다.
export const trainerProfileExample = {
  ...trainerProfileInitial,
  rating: 4.9, reviewCount: 128,
  specialties: ["다이어트", "재활운동", "체력향상", "바디프로필", "임산부PT"],
  introduction: "안녕하세요. 회원님의 목표와 현재 운동 수준에 맞춰 꾸준히 이어갈 수 있는 운동을 만들어가는 트레이너 김재민입니다. 운동이 처음이라 어렵게 느껴지는 분들도 부담 없이 시작할 수 있도록 동작 하나하나 쉽게 설명해드리고 있습니다. PT 시간뿐만 아니라 혼자 운동하는 날에도 스스로 운동을 이어갈 수 있도록 루틴과 운동 방법을 꼼꼼하게 안내해드릴게요.",
  location: { name: "다짐 오류동역점", address: "서울특별시 구로구 오류동 123-45", detailAddress: "" },
  prices: [
    { id: "example-price-1", count: 1, benefit: "", price: "50000" },
    { id: "example-price-10", count: 10, benefit: "3개월 이용권 증정", price: "450000" },
    { id: "example-price-20", count: 20, benefit: "6개월 이용권 증정", price: "850000" },
  ],
  careers: [
    { id: "example-career", name: "다짐 피트니스 오류동역점", startDate: "2023-03-01", endDate: "", position: "트레이너" },
    { id: "example-career-2", name: "나나짐 신도림점", startDate: "2021-08-01", endDate: "2023-01-01", position: "트레이너" },
  ],
  certificates: [
    { id: "example-certificate", name: "생활스포츠지도사 2급", acquiredDate: "2024-03-01", issuer: "문화체육관광부" },
    { id: "example-certificate-2", name: "NASM-CPT", acquiredDate: "2024-01-01", issuer: "National Academy of Sports Medicine" },
  ],
  reviews: [
    { id: "example-review-1", name: "노유나", rating: 4, date: "2024.05.20", content: "운동 첨해봤는데 진짜 잘 배웠어용 돈이 안 아깝네요 근데 수업을 매번 늦으시고 피티 일정 바꿀때가 많아서 별 한개 뺐습니다.." },
    { id: "example-review-2", name: "김태현", rating: 4, date: "2024.05.22", content: "처음 운동하는데 강사분이 친절하게 알려주셔서 좋았어요. 시설도 깨끗하고 분위기가 좋아서 계속 다니고 싶네요." },
    { id: "example-review-3", name: "이수민", rating: 5, date: "2024.05.23", content: "운동 효과가 빨리 나타나서 만족스럽습니다. 다양한 기구가 있어 지루하지 않고 매번 새로운 도전을 할 수 있어 좋아요." },
    { id: "example-review-4", name: "박준호", rating: 5, date: "2024.05.24", content: "강사진이 전문적이고 친절해서 질문할 때마다 상세히 답변해 줍니다. 덕분에 운동 방법을 정확히 배울 수 있어 큰 도움이 됐어요." },
    { id: "example-review-5", name: "이미영", rating: 3, date: "2024.05.22", content: "시설이 매우 청결하고 최신 장비가 구비되어 있어 쾌적하게 운동할 수 있었습니다. 트레이너의 피드백도 매우 유익했어요." },
    { id: "example-review-6", name: "김성민", rating: 5, date: "2024.05.20", content: "소규모 그룹 수업이라 집중도가 높고 동기부여가 잘 됩니다. 다양한 프로그램 덕분에 지루할 틈이 없어요." },
    { id: "example-review-7", name: "정혜진", rating: 5, date: "2024.05.18", content: "처음 운동하는 사람도 부담 없이 시작할 수 있도록 친절하게 안내해 주셔서 감사해요. 꾸준히 다닐 의욕이 생깁니다." },
    { id: "example-review-8", name: "정혜진", rating: 5, date: "2024.05.18", content: "처음 운동하는 사람도 부담 없이 시작할 수 있도록 친절하게 안내해 주셔서 감사해요. 꾸준히 다닐 의욕이 생깁니다." },
  ],
};

// 실제 프로필 탭에서 리뷰 진입을 확인하기 위한 임시 목업입니다.
// 서버 연동 시 Provider의 initialProfile을 실제 응답으로 교체합니다.
export const trainerProfileWithMockReviews = {
  ...trainerProfileInitial,
  reviews: trainerProfileExample.reviews,
  reviewCount: trainerProfileExample.reviews.length,
  rating: trainerProfileExample.reviews.reduce((sum, review) => sum + review.rating, 0) / trainerProfileExample.reviews.length,
};
