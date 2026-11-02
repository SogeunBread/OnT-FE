import StarOn from "@/assets/figma/star-on.svg";
import StarOff from "@/assets/figma/star-off.svg";
import { Pressable, View } from "react-native";

export default function Star({
  active = true,
  activeIcon = StarOn,
  onPress,
  accessibilityLabel = "별점",
  className = "",
}) {
  const Icon = active ? activeIcon : StarOff;
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
      hitSlop={8}
      onPress={onPress}
      className={className}
    >
      <Icon />
    </Pressable>
  ) : (
    <View
      accessible
      accessibilityLabel={`${accessibilityLabel} ${active ? "켜짐" : "꺼짐"}`}
      className={className}
    >
      <Icon />
    </View>
  );
}
