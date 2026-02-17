import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, View } from "react-native";

const Heart = ({
  liked,
  defaultLiked = false,
  onChange,
  className = "",
  iconClassName = "",
  size = 24,
  activeColor = "#FF795E", // 여기엔 문자열 색상값만 받기 때문에 색상 코드로 둠
  inactiveColor = "#111111",
  hitSlop = 10,
  ...restProps
}) => {
  const isControlled = typeof liked === "boolean";
  const [internalLiked, setInternalLiked] = useState(defaultLiked);

  const isLiked = isControlled ? liked : internalLiked;

  const handleToggle = () => {
    const next = !isLiked;

    if (!isControlled) {
      setInternalLiked(next);
    }
    onChange?.(next);
  };

  return (
    <Pressable
      {...restProps}
      onPress={handleToggle}
      className={`self-start ${className}`}
      accessibilityRole="button"
      accessibilityLabel={isLiked ? "좋아요 취소" : "좋아요"}
      accessibilityState={{ selected: isLiked }}
      hitSlop={hitSlop}
    >
      <View className={iconClassName}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={size}
          color={isLiked ? activeColor : inactiveColor}
        />
      </View>
    </Pressable>
  );
};

export default Heart;