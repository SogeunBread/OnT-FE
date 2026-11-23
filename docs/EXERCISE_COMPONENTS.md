# 운동·루틴 컴포넌트

실제 화면과 API에 연결하기 전의 UI 구성 요소다. `/component-preview` 상단에서
목업을 사용한 입력·선택·삭제·권한별 상태를 확인할 수 있다.

## 데이터 계약

- 운동 정의: `{ id, name, category, metrics, isCustom? }`
- 기록: `{ id, exerciseId, name, category, metrics, sets, duration? }`
- 세트: `{ weight?, reps?, duration?, rest? }` 값은 입력 중인 문자열이다.
- 단일 시간 운동은 `metrics: ["duration"]`, `duration: "HH:MM:SS"`를 사용한다.
- 루틴: `{ id, name, trainerAssigned, records }`
- `id`는 목록 내에서 유일해야 한다. 같은 운동도 별도 기록이면 별도 ID를 사용한다.
- `createExerciseRecord`는 운동 정의를 복사하고 기록 ID를 생성한다.
  `cloneExerciseRecords`는 세트와 항목까지 복사해 원본 루틴을 보호한다.

## 공개 컴포넌트

| 이름 | 주요 props / 콜백 |
| --- | --- |
| ExerciseRecordList | `records`, `emptyText` |
| ExerciseEditor | `records`, `onChange(nextRecords)`, `onAddExercise`, `disabled` |
| ExerciseSelection | `exercises`, `selectedIds`, `onSelectionChange(ids)`, `onConfirm(definitions)`, `onCreateExercise`, `onManageExercise(definition)` |
| CustomExerciseSheet | `visible`, `onClose`, `initialValue`, `onSubmit(definition)`, `busy`, `error` |
| ExerciseActionSheet | `visible`, `exercise`, `onClose`, `onEdit(exercise)`, `onDelete(exercise)` |
| ExerciseRecordCard | `type` (`exercise`/`pt`), `title`, `time`, `location`, `exerciseCount`, `sessionLabel`, `showConfirmation`, `memberConfirmed`, `trainerConfirmed`, `onPress`, `onConfirm` |
| ExerciseDetailSheet | `visible`, `onClose`, `type`, `title`, `dateLabel`, `sessionLabel`, `records`, `memo`, `canEdit`, `canDelete`, `onEdit`, `onDelete` |
| RoutineDetailSheet | `visible`, `routine`, `onClose`, `onRecord(routine)` |
| RoutineActionSheet | `visible`, `routine`, `onClose`, `canEdit`, `canDelete`, `onEdit(routine)`, `onDelete(routine)` |
| ConfirmDialog | `visible`, `title`, `content`, `icon`, `confirmText`, `cancelText`, `cancelVariant`, `onConfirm`, `onCancel`, `busy` |

`components/exercise`에서 운동 컴포넌트와 모델 유틸리티를 named import할 수 있다.
루틴 2종은 `components/routine`, 확인 팝업은 `components/modal`의 named export다.
기존 default export는 유지한다.

## 상태 및 동작

- 편집기는 controlled다. `onChange`로 받은 값을 호출 화면의 초안에 반영한다.
- 선택기는 controlled 또는 `defaultSelectedIds`를 사용한 로컬 상태를 지원한다.
  선택 순서대로 운동 정의를 반환하며, 기록 생성은 호출하는 화면에서 한다.
- 바텀시트와 팝업의 열림은 `visible`로 제어한다. `onClose`/`onCancel`에서 닫는다.
  저장·수정·삭제 콜백을 받은 뒤 실제 데이터 변경과 화면 닫기는 호출자가 처리한다.
- 관리 메뉴의 삭제 콜백은 확인 팝업에서 동의한 후에만 실행된다.
- 신규 운동 폼은 열 때 초기화된다. 저장 콜백에는 공백을 정리한 이름,
  단일 카테고리, 1~3개의 기록 항목을 전달한다. 신규 ID는 호출자가 부여한다.
- `error`로 서버 오류 등을 표시하고 `busy`로 중복 저장 및 닫기를 막을 수 있다.
- 트레이너 지정 루틴은 `canEdit` 값과 관계없이 수정 불가다. 삭제는 기본 허용한다.
- PT 상세 수정은 `canEdit`을 명시적으로 전달해야 한다. 완료 확인 여부로 잠그지 않는다.
- 루틴 제한 5개(`ROUTINE_LIMIT`)와 실제 추가/저장은 호출 화면에서 적용한다.
  미리보기에서는 트레이너 지정 루틴까지 포함해 제한을 시연한다.
- 원본 운동 삭제 후에도 기존 기록은 유지한다. 복사한 루틴을 수정해도 원본을 바꾸지 않는다.

## 검증 명령

`node --test tests/exerciseModel.test.mjs`

`npx expo export --platform all --output-dir /tmp/ont-components-check`

실제 브라우저·모바일에서 확인한 범위는 `PROGRESS.md`에서 별도로 관리한다.
