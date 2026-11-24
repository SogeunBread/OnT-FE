import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMemberSettings } from "./MemberSettingsProvider";
import Frame, { Empty, useSettingsNavigation } from "./Frame";
import { reviewAvailability, reviewDraftKey } from "./state";
import { settingsRoutes } from "./navigation";
import ReviewForm from "./ReviewForm";
export default function ReviewScreen({ historyId: override, reviewId: reviewOverride }) {
  const params = useLocalSearchParams(); const id = override ?? (typeof params.id === "string" ? params.id : ""); const reviewId = reviewOverride ?? (typeof params.reviewId === "string" ? params.reviewId : null);
  const { state, policy, send, saveReview } = useMemberSettings(); const nav = useSettingsNavigation(); const [ready, setReady] = useState(false); const [error, setError] = useState("");
  useEffect(() => setReady(true), []);
  const history = state.histories.find(item => item.id === id); const existing = state.reviews.find(item => item.id === reviewId && item.historyId === id);
  const key = reviewDraftKey(id, reviewId); const value = state.drafts[key] ?? { rating: existing?.rating ?? 0, text: existing?.text ?? "" };
  const problem = reviewId ? (!existing || !policy.allowEdit ? "수정할 수 없는 리뷰예요." : "") : reviewAvailability(history, state.reviews, Date.now(), policy);
  return <Frame title="수업 요청 이력">{!ready ? null : !history || problem ? <Empty text={!history ? "수업 이력을 찾을 수 없어요." : problem} /> : <ReviewForm trainer={history.trainer} value={value} onChange={draft => { send({ type: "draft", key, value: draft }); setError(""); }} error={error}
    disabled={!Number.isInteger(value.rating) || value.rating < 1 || value.rating > 5 || (policy.textRequired && !value.text.trim())} onSave={() => {
      if (saveReview({ historyId: id, reviewId, ...value })) nav.dismissTo(reviewId ? settingsRoutes.reviews : settingsRoutes.history);
      else setError("리뷰를 저장할 수 없어요. 작성 기간과 입력 내용을 확인해주세요.");
    }} />}</Frame>;
}
