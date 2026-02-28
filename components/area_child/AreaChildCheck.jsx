import CheckIcon from "@/assets/icons/check.svg";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const AreaChildCheck = ({
  title = "title",
  checked,
  defaultChecked = false,
  onChange,
  className = "",
  titleClassName = "",
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

  const textTone = isChecked ? "text-primary-main" : "text-text-sub";
  const textWeight = isChecked
    ? "font-pretendard-semibold"
    : "font-pretendard-regular";

  return (
    <Pressable
      {...restProps}
      onPress={handleToggle}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityState={{ selected: isChecked }}
      className={`w-40 h-11 flex-row items-center justify-between px-2 py-2.5 ${className}`}
    >
      <Text
        numberOfLines={1}
        className={`text-14 leading-5 ${textTone} ${textWeight} ${titleClassName}`}
      >
        {title}
      </Text>

      {isChecked ? (
        <View className="h-6 w-6 items-center justify-center">
          <CheckIcon width={24} height={24} color="#FF795E" />
        </View>
      ) : null}
    </Pressable>
  );
};

export default AreaChildCheck;