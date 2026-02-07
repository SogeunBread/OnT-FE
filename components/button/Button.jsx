import { colors } from "@/tailwind.config";
import { Pressable, Text } from "react-native";

const Button = ({
  text = "button",
  state = "default",
  style = "weak",
  disabled = false,
  ...props
}) => {
  // 상태와 스타일에 따른 배경색 결정
  const getBackgroundColor = () => {
    // 비활성화 상태
    if (state === "disabled" || disabled) {
      return colors.grayscale.G200; // #CFCFCF
    }
    // 클릭 상태 + 채운 스타일
    if (state === "click" && style === "fill") {
      return colors.primary[500]; // #EF6346
    }
    // 클릭 상태 + 약한 스타일
    if (state === "click" && style === "weak") {
      return colors.primary[100]; // #FFCFC5
    }
    // 기본 상태 + 채운 스타일
    if (state === "default" && style === "fill") {
      return colors.primary.main; // #FF795E
    }
    // 기본 상태 + 약한 스타일
    return colors.primary[50]; // #FFECE8
  };

  // 상태와 스타일에 따른 텍스트 색상 결정
  const getTextColor = () => {
    // 비활성화 상태
    if (state === "disabled" || disabled) {
      return colors.grayscale.G500; // #888888
    }
    // 채운 스타일일 때 흰색 텍스트
    if ((state === "default" || state === "click") && style === "fill") {
      return colors.text.inverse; // #FFFFFF
    }
    // 약한 스타일일 때 주황색 텍스트
    return colors.primary.main; // #FF795E
  };

  // 상태에 따른 폰트 가중치 결정
  const getFontWeight = () => {
    // 비활성화 상태는 Medium 가중치
    if (state === "disabled" || disabled) {
      return "500"; // 16/Medium
    }
    // 그 외는 SemiBold 가중치
    return "600"; // 16/Semibold
  };

  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();
  const fontWeight = getFontWeight();

  return (
    <Pressable
      {...props}
      disabled={disabled || state === "disabled"}
      className="px-5 py-2.5 rounded-lg items-center justify-center"
      style={{
        backgroundColor: backgroundColor,
        opacity: disabled || state === "disabled" ? 0.6 : 1,
      }}
    >
      <Text
        className="text-16 font-pretendard-semibold"
        style={{
          fontWeight: fontWeight,
          color: textColor,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default Button;
