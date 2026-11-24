import RequestDetails from "@/components/pt-request/RequestDetails";
import Button from "@/components/button";
import FieldLong from "@/components/field-long";
import RadioBig from "@/components/radio/RadioBig";
import { useRef, useState } from "react";
import { Keyboard, Text, View } from "react-native";
import ChatSheet from "./ChatSheet";

export const rejectionReasons = [
  "일정이 맞지 않습니다",
  "현재 신규 회원을 받고 있지 않습니다",
  "거리가 멀어 수업이 어렵습니다",
  "운동 목적과 맞지 않습니다",
  "기타 사유",
];

function RequestSheetContent({
  onClose,
  request,
  status,
  onAccept,
  onReject,
  initialStep,
  initialReason,
  initialOtherReason,
}) {
  const [step, setStep] = useState(initialStep);
  const [reason, setReason] = useState(initialReason);
  const [otherReason, setOtherReason] = useState(initialOtherReason);
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);
  const resolved = status !== "pending";
  const disabled = resolved || submitting;
  const title = step === "request"
    ? "PT 수업 요청서"
    : step === "reasons"
      ? "거절 사유를 선택해주세요."
      : "거절 사유를 입력해주세요.";
  const close = () => {
    Keyboard.dismiss();
    onClose?.();
  };
  const back = () => {
    Keyboard.dismiss();
    if (step === "other") setStep("reasons");
    else if (step === "reasons") setStep("request");
    else close();
  };
  const submit = (callback, value) => {
    if (disabled || submitted.current || !callback) return;
    submitted.current = true;
    setSubmitting(true);
    Keyboard.dismiss();
    callback(value);
  };
  const reject = () => {
    if (disabled || !rejectionReasons.includes(reason)) return;
    if (reason === "기타 사유") setStep("other");
    else submit(onReject, reason);
  };

  return (
    <ChatSheet
      label={title}
      onClose={close}
      onBack={back}
      footer={step === "request" ? (
        <View className="flex-row gap-4">
          <Button
            text="거절"
            variant="weak"
            className="w-[120px]"
            accessibilityRole="button"
            disabled={disabled || !onReject}
            onPress={() => setStep("reasons")}
          />
          <Button
            text="수락"
            variant="fill"
            className="flex-1"
            accessibilityRole="button"
            disabled={disabled || !onAccept}
            onPress={() => submit(onAccept)}
          />
        </View>
      ) : (
        <Button
          text={step === "other" ? "완료" : "거절"}
          variant="fill"
          accessibilityRole="button"
          disabled={disabled || !onReject || (step === "other" ? !otherReason.trim() : !rejectionReasons.includes(reason))}
          onPress={step === "other" ? () => {
            const value = otherReason.trim();
            if (value) submit(onReject, value);
          } : reject}
        />
      )}
    >
      <View className="gap-5">
        <View className={step === "request" ? "border-b border-grayscale-G50 py-2" : "gap-1"}>
          <Text accessibilityRole="header" className="text-18 font-pretendard-bold text-text">
            {title}
          </Text>
          {step === "other" && (
            <Text className="text-14 font-pretendard-regular text-text-disabled">
              입력한 사유는 회원에게 전달됩니다.
            </Text>
          )}
        </View>
        {step === "request" && (
          <RequestDetails request={request} />
        )}
        {step === "reasons" && (
          <View accessibilityRole="radiogroup" className="gap-4 pb-2">
            {rejectionReasons.map((item) => (
              <RadioBig
                key={item}
                title={item}
                subtitle=""
                subtitleClassName="hidden"
                titleNumberOfLines={0}
                checked={reason === item}
                disabled={disabled}
                onChange={() => setReason(item)}
                className="min-h-[55px] !py-2"
                hitSlop={0}
              />
            ))}
          </View>
        )}
        {step === "other" && (
          <FieldLong
            accessibilityLabel="거절 사유"
            placeholder="거절 사유를 상세히 입력해주세요."
            className="w-full !rounded-lg"
            value={otherReason}
            onChangeText={setOtherReason}
            disabled={disabled}
          />
        )}
      </View>
    </ChatSheet>
  );
}

export default function RequestSheet({
  visible = false,
  status = "pending",
  initialStep = "request",
  initialReason = "",
  initialOtherReason = "",
  ...props
}) {
  return visible ? (
    <RequestSheetContent
      {...props}
      status={status}
      initialStep={initialStep}
      initialReason={initialReason}
      initialOtherReason={initialOtherReason}
    />
  ) : null;
}
