# 진행 상황

## 컴포넌트 구현 상태

2026-11-02 기준. 구현과 검증 완료는 구분한다.

| Figma 이름 | 상태 | 코드 |
| --- | --- | --- |
| workout-card | 4변형 구현, 웹 확인 | components/workout_card/ |
| routine | 트레이너 지정/개인 구현, 웹 확인 | components/routine/ |
| toggle | off/on 구현, 웹 확인 | components/toggle/ |
| chat | 텍스트/사진 × 나/상대 구현, 웹 확인 | components/chat/ |
| button-icon | white/primary 및 누름 상태 구현, 웹 확인 | components/button_icon/ |
| chat-meal | 회원/트레이너 구현, 웹 확인 | components/chat_meal/ |
| chat-PT | 등록/수정/취소 구현, 웹 확인 | components/chat_pt/ |
| chat-list | 읽지 않은 메시지 유무 구현, 웹 확인 | components/chat_list/ |
| list | 이동/토글 구현, 웹 확인 | components/list/ |
| tag | 기존 컴포넌트 보완, 웹 확인 | components/tag/ |
| header-detail | 좋아요/비교/관리 구현, 웹 확인 | components/header_detail/ |
| field | 기본/입력/채움/비활성 및 검색 아이콘 구현, 웹 확인 | components/field/ |
| review-list | 별점/프로필/리뷰 구현, 웹 확인 | components/review_list/ |
| star | on/off 구현, 웹 확인 | components/star/ |
| trainer-list | 태그 유무 구현, 웹 확인 | components/trainer_list/ |

- 15종의 구현을 완료했다. 새 Figma 파일에서 남은 4종의 상세 디자인을 확보했다.
- 후속 노드: chat 24:195, chat-meal 24:221, chat-PT 24:238,
  review-list 24:339.
- Chat의 timeShow는 대화 화면이 전달한다. 같은 시간의 메시지 묶음 중
  마지막 메시지에만 시간을 표시하도록 호출하는 쪽에서 결정한다.
- Chat의 사진은 기본 너비 200px이며 로딩된 이미지 비율에 맞춰 높이를 조절한다.
  imageAspectRatio로 사전에 비율을 전달할 수 있고, onPressPhoto로 상세 보기를 연결한다.
- ChatMeal과 ChatPT의 상세 보기 동작은 onPress로 연결한다.
  ChatPT의 update는 previousTime을 받으며, delete에는 상세 버튼이 없다.
- 미리보기 예시 데이터는 constants/componentPreview.js에 둔다.
- toggle은 list 상세 응답에 포함된 치수와 스타일을 바탕으로 구현했다.
- 미리보기 실행을 막던 app/_layout.jsx의 JSX 태그 불일치를 수정하고
  GestureHandlerRootView 및 기존 Pretendard 에셋 로딩을 연결했다.

## 검증 결과

- 웹 정적 빌드 및 Android/iOS 번들 생성 확인.
- 브라우저에서 전체 15종의 렌더링 확인. 정적 SVG의 원본 치수를 유지한다.
- 세트 추가·삭제, 빈 세트에서 삭제 비활성화, 입력값 변경,
  운동 삭제·복원, 토글 전환, 별점 선택, 좋아요 전환,
  검색 입력의 포커스 테두리, 주요 버튼 콜백을 확인했다.
- 390px 및 320px 웹 화면을 확인했다. 모바일 실기기 검증은 미수행이다.
- 일반 사용자/트레이너 실제 화면에 새 컴포넌트를 조립하는 작업과
  서버 연동은 아직 하지 않았다. 검증은 개발용 미리보기에서 진행했다.
- 기존 Button의 disabled 상태가 기본 스타일로 되돌아가는 문제를 수정했다.
- 후속 4종 검증: 채팅 사진 선택, 회원/트레이너 식단 확인, PT 상세 보기
  콜백과 취소 카드의 버튼 미노출을 확인했다.
- 식단 카드 280×184px, PT 등록/수정 카드 280×157px / 280×175px를 확인했다.
- 320px 웹 너비에서 긴 채팅 줄바꿈, 시간 생략, 가로 사진 200×100px를 확인했다.
- 다음 작업: 실제 화면에 컴포넌트 연결, API 연동, 모바일 실기기 검증.
