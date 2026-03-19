import React from "react";
import { Pressable, Text } from "react-native";

const Chip = ({
  text = "text",
  selected = true,
  disabled = false,
  onPress,
  className = "",
  textClassName = "",
  ...props
}) => {
  const containerTone = selected ? "bg-primary-main" : "bg-grayscale-G100";
  const textTone = selected ? "text-text-inverse" : "text-grayscale-G600";
  const textWeight = selected
    ? "font-pretendard-semibold"
    : "font-pretendard-regular";

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`self-start items-center rounded-[20px] px-4 py-1.5 ${containerTone} ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <Text className={`text-14 leading-[21px] ${textTone} ${textWeight} ${textClassName}`}>
        {text}
      </Text>
    </Pressable>
  );
};

export default Chip;
