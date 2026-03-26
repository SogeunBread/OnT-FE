import Radio from "@/components/radio/Radio";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const RadioBig = ({
  title = "메인 텍스트",
  subtitle = "서브 텍스트",
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  radioClassName = "",
  hitSlop = 6,
  ...restProps
}) => {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
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
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected: isChecked, disabled }}
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

      {/* 우측 라디오 버튼 */}
      <View pointerEvents="none">
        <Radio
          checked={isChecked}
          disabled={disabled}
          className={radioClassName}
        />
      </View>
    </Pressable>
  );
};

export default RadioBig;