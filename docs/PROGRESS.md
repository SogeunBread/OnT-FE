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

## 운동·루틴 추가 컴포넌트 — 2026-11-04

화면 연결 전에 사용할 추가 컴포넌트 10종을 구현했다. 기존 15종의 검증 기록과
구분하며, 이번 추가 UI는 브라우저 조작 검증을 완료하지 않았다.

| 컴포넌트 | 위치 | 구현 내용 |
| --- | --- | --- |
| ExerciseRecordList | components/exercise/ | 시간 단독 및 1~3열 세트 기록 조회 |
| ExerciseEditor | components/exercise/ | WorkoutCard 조합, 운동·세트 삭제/추가, 값 변경, 읽기 전용 |
| ExerciseSelection | components/exercise/ | 검색, 카테고리 목록, 다중 선택, 선택 해제, MY 관리 콜백 |
| CustomExerciseSheet | components/exercise/ | 이름·단일 카테고리·타입 1~3개, 등록/수정, 오류·저장 중 상태 |
| ExerciseActionSheet | components/exercise/ | MY 운동 수정·삭제 및 삭제 확인 |
| ExerciseRecordCard | components/exercise/ | 개인 운동/PT 카드, 회원·트레이너 확인 상태, 확인 콜백 |
| ExerciseDetailSheet | components/exercise/ | 기록·메모 조회, 권한별 수정/삭제, 내부 스크롤 |
| RoutineDetailSheet | components/routine/ | 루틴·트레이너 지정 표시, 기록 조회, 일지 기록 콜백 |
| RoutineActionSheet | components/routine/ | 지정 루틴 수정 금지, 삭제 허용 및 경고 팝업 |
| ConfirmDialog | components/modal/ | 실제 모달 표시, 배경 차단, 취소/확인 및 처리 중 상태 |

- 기존 기본 export와 props 기본값을 유지하며 Modal, Field, WorkoutCard,
  CheckSquare, ChipArea, ButtonTwo에 필요한 선택형 props를 추가했다.
- 내부 공통 Sheet는 Gorhom 바텀시트와 네이티브 Modal을 조합한다.
  키보드 입력은 BottomSheetTextInput으로 연결하고 Safe Area를 반영한다.
- 공통 데이터 계약과 컴포넌트 props는 [EXERCISE_COMPONENTS.md](EXERCISE_COMPONENTS.md)에 정리했다.
- 목업 데이터는 constants/exercisePreviewData.js에 있으며,
  /component-preview 상단에 추가 10종의 상태·콜백 예제를 연결했다.
- 실제 운동·루틴 페이지 연결과 API 저장은 아직 구현하지 않았다.

### 반영할 정책

- 개인 운동일지는 과거·오늘·미래 모두 작성 가능하다.
- 루틴은 트레이너 지정 루틴을 포함해 최대 5개다. 미리보기에서도 한도를 적용한다.
- 트레이너 지정 루틴은 수정 불가·삭제 가능하며 삭제 전에 경고한다.
- PT 수정 시작 시점은 보류 중이다. 컴포넌트는 canEdit을 명시적으로 전달받는다.
- 양쪽 PT 완료 확인은 상태만 표시하고, 회차 차감은 보류한다.
  완료 확인 자체를 수정 잠금 조건으로 사용하지 않는다.
- 루틴을 일지로 복사할 때 원본을 보호하는 유틸리티를 제공한다.
  작성 중 루틴 추가/교체 방식은 실제 화면 연결 전에 확정한다.

### 이번 검증 및 남은 작업

- node --test tests/exerciseModel.test.mjs: 4개 통과.
  운동 정의/기록 분리, 루틴 깊은 복사, 시간 형식, 신규 운동 제약을 검증했다.
- Expo 웹 정적 빌드 및 Android/iOS 번들 생성 통과.
- 정적 SVG 3개를 로컬 저장하고 원본 크기(16px 체크 2종, 48px 경고)를 유지했다.
- 현재 컴퓨터 사용 도구의 브라우저 접근 정책으로 화면 조작 검증이 차단되었다.
  이번 추가 UI의 실제 레이아웃·닫기·선택·중첩 팝업·콜백은 브라우저에서 미검증이다.
- 다음 검증: 320px/390px 레이아웃, 바텀시트 드래그/스크롤/배경 닫기,
  키보드 회피, 선택 제한, 지정 루틴 권한, 기존 공통 컴포넌트 사용처 확인.
- 다음 개발: 검증 후 실제 운동·루틴 화면 및 초안 상태 관리 연결.
