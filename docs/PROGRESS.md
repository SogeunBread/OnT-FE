# 진행 상황

## 트레이너 채팅 — 2026-11-24

- 후속 수정: 거절 사유 목록 하단에 8px 내부 여백을 추가해 마지막 `기타 사유`
  카드의 그림자가 ScrollView 경계에서 잘리지 않도록 했다. 390×844 / 320×640 웹에서
  그림자 여백·선택 전후 버튼 상태·기타 사유 입력 전환을 확인했고 웹 빌드가 통과했다.
  모바일 실기기에서의 그림자 확인은 미수행이다.
- 브랜치: `feature/25-trainer-chat` (`origin/dev` 기준).
- Figma 12개 상태 구현: 내 회원/상담 회원 목록, 회원 채팅·사진, 회원 상세,
  상담 요청 도착/대화, PT 요청서, 수락 결과, 거절 사유 선택 전/후,
  기타 사유 입력, 거절 결과.
- 코드: `features/trainer-chat/`, 목업 교체 지점: `constants/trainerChat.js`,
  로컬 전이: `state.js`/`TrainerChatProvider.jsx`.
- 진입: `/(trainerTabs)/chat` → `/(trainer)/chat/[id]` →
  `/(trainer)/member-detail?memberId=…`. 신규 상담 요청에서도 해당 채팅방으로 이동한다.
  채팅 목록에는 탭 헤더를 숨기고, 상세 화면은 탭 밖 트레이너 Stack에 등록했다.
- 이름 검색·빈 결과, 읽음 표시, 텍스트/사진 전송, 사진 확대,
  요청서 수락·거절·기타 사유 입력을 로컬 상태로 연결했다.
  완료 요청은 재처리하지 않으며, 수락 시 내 회원으로 이동한다.
- `ChatList`, `Chat`, `HeaderDetail`, `Field`, `ButtonIcon`, `Tab`, `Button`,
  `RadioBig`, `FieldLong`을 재사용했다. `RadioBig`에는 기본값 1을 유지하는
  `titleNumberOfLines`만 추가했다. 기존 사용처를 조사했으며 새 거절 화면에서만 사용한다.
- Figma 정적 에셋 11개를 `assets/figma/chat-*`에 저장했다. 사진 예시는 목업의
  `imageSource`로 전달하며 실제 선택 사진도 같은 props를 사용한다. 임시 URL은 코드에 없다.
- `/component-preview` 상단에 12개 상태별 진입과 상호작용 미리보기를 추가했다.
  미리보기 상태는 실제 채팅 목업 상태와 분리된다.

### 검증

- `node --test tests/trainerChat.test.mjs`: 10개 통과. 읽음, 전송/정렬,
  중복·잘못된 요청 방지, 수락/거절 전이, 날짜·발신자·분별 시간 묶음을 확인했다.
- `npx expo export --platform web`: 통과.
- `npx expo export --platform android --platform ios --output-dir .expo/trainer-chat-native`:
  두 플랫폼 번들 생성 통과. 모바일 실기기 실행 검증과는 구분한다.
- 최종 보완 후 `npx expo export --platform all --output-dir .expo/trainer-chat-final`도 통과했다.
- Chrome 390×844 / 320×640에서 검색·빈 결과, 텍스트·사진 전송·확대,
  회원 상세 왕복, 수락 후 목록 이동, 거절 선택/공백 입력 제한, 완료 후 재처리 방지,
  12개 미리보기 렌더링 및 작은 화면 하단 버튼 접근을 확인했다. 런타임 오류 없음.
- 신규 상담 목록의 기존 진입점·처리 완료 후 제거, 시트 뒤로 가기와 기타 사유 초안 유지,
  잘못된 채팅방/회원 ID의 빈 화면과 직접 진입 후 복귀도 추가 확인했다.
- SVG의 로컬 파일·사용 위치와 아이콘 16/20/24px, 수락 체크 24px,
  장식 약 283.572×68.919px 및 사진 200×134px 표시를 확인했다.

### 남은 작업 / 제한

- API·실시간 수신·인증/서버 권한 검증·영구 저장은 미구현. 새로고침 시 초기화된다.
- 관리 탭은 기존 플레이스홀더다. 회원 상세는 채팅방의 `관리`와 미리보기에서 접근한다.
- 회원 상세의 식단 캘린더·루틴 배포·운동 일지·체중 그래프는 화면 콜백 연결 지점만
  두었으며 현재는 미제공 안내를 표시한다. 기존 회원용 운동 라우트로 보내지 않는다.
- 모바일 실기기의 키보드·Safe Area·사진 권한은 추가 검증이 필요하다.
- 기존 `react-datepicker` CSS exports 및 Browserslist 데이터 경고는 빌드를 막지 않았다.
  홈의 신규 상담 건수도 기존 고정 목업이므로 요청 처리 후 실제 건수 연동은 후속이다.
- 임시 정책과 디자인 데이터 불일치는 `docs/UNCERTAINTY.md`에 기록했다.

## 컴포넌트 구현 상태

2026-11-02 기준. 구현과 검증 완료는 구분한다.

| Figma 이름    | 상태                                               | 코드                      |
| ------------- | -------------------------------------------------- | ------------------------- |
| workout-card  | 4변형 구현, 웹 확인                                | components/workout_card/  |
| routine       | 트레이너 지정/개인 구현, 웹 확인                   | components/routine/       |
| toggle        | off/on 구현, 웹 확인                               | components/toggle/        |
| chat          | 텍스트/사진 × 나/상대 구현, 웹 확인                | components/chat/          |
| button-icon   | white/primary 및 누름 상태 구현, 웹 확인           | components/button_icon/   |
| chat-meal     | 회원/트레이너 구현, 웹 확인                        | components/chat_meal/     |
| chat-PT       | 등록/수정/취소 구현, 웹 확인                       | components/chat_pt/       |
| chat-list     | 읽지 않은 메시지 유무 구현, 웹 확인                | components/chat_list/     |
| list          | 이동/토글 구현, 웹 확인                            | components/list/          |
| tag           | 기존 컴포넌트 보완, 웹 확인                        | components/tag/           |
| header-detail | 좋아요/비교/관리 구현, 웹 확인                     | components/header_detail/ |
| field         | 기본/입력/채움/비활성 및 검색 아이콘 구현, 웹 확인 | components/field/         |
| review-list   | 별점/프로필/리뷰 구현, 웹 확인                     | components/review_list/   |
| star          | on/off 구현, 웹 확인                               | components/star/          |
| trainer-list  | 태그 유무 구현, 웹 확인                            | components/trainer_list/  |

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
- 미리보기 실행을 막던 app/\_layout.jsx의 JSX 태그 불일치를 수정하고
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
