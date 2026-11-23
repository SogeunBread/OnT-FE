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

## 운동·루틴 페이지 연결 — 2026-11-04

### 구현한 화면과 이동

- `/exercise`: 주간 달력, 날짜별 개인 운동/PT 카드, 빈 상태, 기록 추가,
  상세 바텀시트, 개인 일지 삭제, PT 진행 완료 확인을 연결했다.
- `/journal/new`, `/journal/[id]/edit`: 제목·날짜·시작/종료 시간·운동·메모
  작성 및 수정. 날짜는 달력, 시간은 시/분 입력 바텀시트로 선택한다.
- `/exercise-select`: 검색·다중 선택·선택 해제, MY 운동 등록·수정·삭제.
  선택 결과를 기존 초안에 추가하고 작성 화면으로 돌아간다.
- `/routines`, `/routines/new`, `/routines/[id]/edit`: 목록·빈 상태·개수 제한,
  상세·등록·수정·삭제·일지로 복사를 연결했다.
- `/pt/[id]/edit`: 공통 편집 화면과 권한 검사를 준비했다. 정책 보류로
  현재는 진입을 차단하고 안내를 표시한다. 메인 상세에서도 수정 버튼을 숨긴다.
- 운동 메인만 하단 탭에 두고 작성·선택·루틴은 `(exerciseFlow)` Stack에 배치했다.
  운동 탭에서는 기본 HeaderMain을 숨기고 달력을 상단에 표시한다.

### 데이터와 정책

- `features/exercise/ExerciseProvider.jsx`: Context와 reducer로 저장 데이터와
  `draftId`별 초안을 분리한다. 화면 이동 중 제목·시간·세트·메모를 유지한다.
- `features/exercise/state.js`: 저장·삭제·등록 제약·권한·완료 확인을 처리한다.
- `features/exercise/mockData.js`: 현재 날짜 기준 목업 일지·PT·루틴·운동 목록.
  **메모리 상태만 사용하므로 새로고침/앱 재실행 시 목업으로 초기화된다.**
- 과거·오늘·미래 일지 모두 작성 가능. 제목 20자·메모 200자 제한,
  실제 날짜·시각 및 종료 시각을 검사한다. 운동이 있으면 0 값도 저장 가능하다.
- 루틴은 지정 루틴 포함 최대 5개이며, 여러 초안이 있어도 저장 시 다시 검사한다.
  지정 루틴은 수정 불가·삭제 가능하다.
- 루틴을 기존 일지에 불러오면 기존 운동 뒤에 추가한다. 루틴에서 새 일지를
  시작하면 별도 초안을 만든다. 원본 루틴과 기록 값은 서로 복사해 분리한다.
- MY 운동/루틴 삭제는 기존 일지·PT의 운동 스냅샷을 변경하지 않는다.
- PT 종료 이후 회원 확인만 갱신한다. 트레이너 상태는 목업을 표시하며
  클라이언트에서 임의 변경하거나 회차를 차감하지 않는다.
- 뒤로 가기에는 작성 중 이탈 확인을 연결했다. 웹 새로고침/닫기에는 브라우저의
  기본 이탈 확인을 사용한다. 변경 없는 초안도 페이지를 나가면 정리한다.
- 저장 후 목록을 갱신하고, 기존 일지 수정 후에는 해당 상세를 다시 연다.
- Calendar는 기존 기본값을 유지하며 compact 표시, 일정 점 종류, 외부 선택 날짜
  변경에 따른 표시 기간 동기화를 추가했다.

### 검증 결과와 제한

- `node --test tests/exerciseModel.test.mjs tests/exerciseFlow.test.mjs`: 15개 통과.
  과거/미래 저장, 초안 유지, 입력 제한, 루틴 한도/동시 초안, 원본 기록 보존,
  지정 루틴 권한, PT 시간·중복 확인·회차 유지, 복귀 경로 구성을 검사했다.
- `npx expo export --platform all --output-dir /tmp/ont-pages-final`: 웹 정적 라우트 및
  Android/iOS 번들 생성 통과. `git diff --check` 통과.
- 개발 서버를 `npx expo start --localhost --port 8083`으로 실행했다.
  `/exercise`와 `/routines`의 HTTP 200 응답을 확인했다. HTTP 응답은 화면 조작
  검증을 대신하지 않는다.
- 브라우저 자동화는 앞서 확인된 접근 제한으로 이번에도 수행하지 않았다.
  실제 클릭·뒤로 가기·시트 중첩·320px/390px 레이아웃과 모바일 키보드/드래그는
  여전히 직접 검증이 필요하다. 빌드/상태 테스트 통과를 UI 검증 완료로 간주하지 않는다.
- 다음 작업: 실제 화면 수동 QA, PT 수정 시점 확정, API·영구 저장 연동.

## 미확정 사항 관리 — 2026-11-23

- 불명확한 요구사항과 임시 구현은 [UNCERTAINTY.md](UNCERTAINTY.md)에서 관리한다.
- 제공된 PT 권한 표의 내용, 남은 질문, 운동·루틴 임시 동작을 기록했다.
- PT 권한 표에 따른 코드 변경은 아직 하지 않았다. 기존 PT 수정 차단은 유지 중이다.
- 문서 내용과 상대 링크를 확인했다. 기능 변경이 없어 빌드·테스트는 실행하지 않았다.


## PT 회원 수정 권한 반영 — 2026-11-23

- PT 수정 일괄 차단을 제거하고 명시적인 완료 상태에서 회원 수정을 허용했다.
  상호 동의 완료 전후 모두 허용하며 회원 삭제는 계속 제공하지 않는다.
- 수업 날짜·시작·종료 시각은 초안 변경에서 제외하고 저장 시에도 원본과 비교한다.
  저장 직전 완료 상태를 재검사하며 확인 상태·회차·트레이너 정보는 보존한다.
- 목업의 어제 PT를 완료 상태로 지정했다. 완료 판정 자동화나 서버 필드는 만들지 않았다.
- 트레이너 화면·취소·회차 처리와 운동 시간 항목의 수정 범위는
  [UNCERTAINTY.md](UNCERTAINTY.md)에 남겼다.
- 상태 테스트 17개와 Expo 웹 빌드 통과. `git diff --check` 통과.
  실제 화면 조작과 네이티브 동작은 미검증이다.


## 변경사항 커밋 정리 — 2026-11-23

- 운동·루틴 페이지, 공통 컴포넌트 보완, PT 회원 수정 권한과 상태 테스트를
  하나의 기능 커밋으로 정리한다.
- 미확정 사항 관리 규칙과 진행 기록은 별도 문서 커밋으로 정리한다.
- 미확정 사항 파일명은 `docs/UNCERTAINTY.md`로 통일했다.
- 기존 검증: 상태 테스트 17개 및 최신 웹 빌드 통과. 실제 화면 조작은 미검증이다.


## 미확정 사항 문서명 변경 — 2026-11-23

- 파일명을 `docs/UNCERTAINTY.md`로 변경하고 AGENTS.md와 진행 기록의 참조를 갱신했다.
- 파일명과 상대 링크, `git diff --check`를 확인했다. 문서 변경만 있어 테스트는 실행하지 않았다.


## dev 병합 충돌 해결 — 2026-11-23

- 충돌 4개 파일의 양쪽 기능을 병합했다. 루트의 ExerciseProvider와 운동 흐름을
  유지하고 트레이너 상세 그룹을 함께 등록했다.
- 회원 탭의 MealRecordsProvider, 식단 작성 화면의 탭바·헤더 숨김,
  관리 헤더 테두리 설정과 운동 헤더 숨김을 함께 유지했다.
- Modal의 style 지원과 기존 아이콘·className·버튼 상태·View props를 보존했다.
- Calendar의 이벤트 색상, 외부 날짜 동기화, 기간 변경 콜백, 스타일·선택 색상
  옵션을 유지했다. `compactLayout="exercise"`로 운동 화면의 기존 헤더·날짜·요일
  배치를 구분하고, 기본 compact는 dev의 트레이너용 배치를 유지했다.
- `npm ci` 후 의존성 확인 통과. 상태 테스트 17개, 웹 정적 빌드와 Android/iOS
  번들 생성, 충돌 표시 검색 및 `git diff --check` 통과.
- 빌드에 react-datepicker CSS의 package exports 경고가 있으나 파일 경로 대체로
  빌드는 완료됐다. 관련 없는 의존성·스타일 경로는 수정하지 않았다.
- 브라우저 접근 제한으로 실제 화면 조작은 수행하지 않았다. 운동·관리·트레이너
  달력의 320px/390px 배치, 날짜·기간 이동, 식단 작성 복귀, 삭제 팝업 및
  모바일 키보드·사진·날짜 선택·바텀시트 검증은 남아 있다.
- 충돌 해결 파일은 스테이징하며 병합 커밋은 아직 생성하지 않는다.
