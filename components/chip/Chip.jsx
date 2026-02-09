import { colors } from "@/tailwind.config";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Pressable, Text } from "react-native";

const Chip = ({
  text = "선택한 지역",
  onClose,
  onPress,
  disabled = false,
  className = "",
  textClassName = "",
  closeClassName = "",
  ...restProps
}) => {
  const handleClose = (e) => {
    e?.stopPropagation?.();
    onClose?.(e);
  };

  return (
    <Pressable
      {...restProps}
      onPress={onPress}
      className={`self-start flex-row items-center gap-2 rounded-[20px] bg-primary-main px-2 py-1 ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <Text
        className={`text-xs font-pretendard-semibold leading-4 text-white ${textClassName}`}
      >
        {text}
      </Text>

      <Pressable
        disabled={disabled}
        onPress={handleClose}
        hitSlop={10}
        className={`h-3 w-3 items-center justify-center rounded-[20px] bg-white p-0.5 ${closeClassName}`}
      >
        <AntDesign name="close" size={8} color={colors.primary.main} />
      </Pressable>
    </Pressable>
  );
};

export default Chip;
