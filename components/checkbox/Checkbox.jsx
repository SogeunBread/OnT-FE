import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const Checkbox = ({
  title = "메인 텍스트",
  subtitle = "서브 텍스트",
  checked,
  defaultChecked = false,
  onChange,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  indicatorClassName = "",
  hitSlop = 6,
  ...restProps
}) => {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    const next = !isChecked;

    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const cardTone = isChecked ? "bg-primary-50" : "bg-white";
  const indicatorTone = isChecked ? "bg-primary-main" : "bg-grayscale-G400";

  return (
    <Pressable
      {...restProps}
      onPress={handleToggle}
      hitSlop={hitSlop}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      className={`w-full flex-row items-center gap-5 rounded-lg px-4 py-3 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)] ${cardTone} ${className}`}
    >
      {/* 좌측 텍스트 */}
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className={`text-14 font-pretendard-semibold text-text ${titleClassName}`}
        >
          {title}
        </Text>

        <Text
          numberOfLines={1}
          className={`mt-1 text-12 font-pretendard-regular text-grayscale-G400 ${subtitleClassName}`}
        >
          {subtitle}
        </Text>
      </View>

      {/* 우측 체크 원 */}
      <View
        className={`h-6 w-6 items-center justify-center rounded-[20px] ${indicatorTone} ${indicatorClassName}`}
      >
        <Ionicons name="checkmark" size={16} color="white" />
      </View>
    </Pressable>
  );
};

export default Checkbox;