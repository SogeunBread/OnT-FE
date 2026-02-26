import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Check from "../check/Check";

const CheckboxBig = ({
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
      <View className="flex-1 gap-1">
        <Text
          numberOfLines={1}
          className={`text-24 font-pretendard-bold text-text ${titleClassName}`}
        >
          {title}
        </Text>

        <Text
          numberOfLines={1}
          className={`text-16 font-pretendard-medium text-text-sub ${subtitleClassName}`}
        >
          {subtitle}
        </Text>
      </View>

      {/* 우측 체크 원 */}
      <View pointerEvents="none">
        <Check checked={checked} />
      </View>
    </Pressable>
  );
};

export default CheckboxBig;
