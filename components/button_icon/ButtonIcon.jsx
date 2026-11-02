import { Pressable, View } from "react-native";
import { useState } from "react";

export default function ButtonIcon({
  icon,
  variant = "white",
  state = "default",
  onPress,
  disabled = false,
  accessibilityLabel = "아이콘 버튼",
  className = "",
}) {
  const [pressed, setPressed] = useState(false);
  const active = pressed || state === "click";
  const background =
    variant === "primary"
      ? active
        ? "bg-primary-500"
        : "bg-primary-main"
      : active
      ? "bg-grayscale-G50"
      : "bg-white";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={`h-11 w-11 items-center justify-center rounded-lg ${
        variant === "white" ? "border border-grayscale-G300" : ""
      } ${background} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {icon ?? (
        <View className="h-6 w-6 items-center justify-center">
          <View className="h-5 w-5 rounded border border-dashed border-grayscale-G500" />
        </View>
      )}
    </Pressable>
  );
}
