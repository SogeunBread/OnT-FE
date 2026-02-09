import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

const Chip = ({
  text = "선택한 지역",
  onClose,
  onPress,
  disabled = false,
  className = "",
  textClassName = "",
  closeClassName = "",
  ...props
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  const handleClose = (e) => {
    e?.stopPropagation?.();
    setVisible(false);
    if (onClose) {
      onClose(e);
    }
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPress={onPress}
      className={`self-start flex-row items-center justify-start gap-2 rounded-[20px] bg-red-400 px-2 py-1 ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <Text
        className={`text-xs font-pretendard-semibold leading-4 text-white ${textClassName}`}
      >
        {text}
      </Text>

      <Pressable
        disabled={disabled}
        onPress={handleClose}
        className={`h-3 w-3 items-center justify-center rounded-[20px] bg-white p-0.5 ${closeClassName}`}
      >
        <View className="relative h-2 w-2">
          <View className="absolute left-0 top-[3.5px] h-[1px] w-2 rotate-45 bg-red-400" />
          <View className="absolute left-0 top-[3.5px] h-[1px] w-2 -rotate-45 bg-red-400" />
        </View>
      </Pressable>
    </Pressable>
  );
};

export default Chip;
