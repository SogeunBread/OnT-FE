import { useState } from "react";
import { Pressable, Text } from "react-native";

const AreaParent = ({
  title = "title",
  selected,
  defaultSelected = false,
  onChange,
  className = "",
  textClassName = "",
  hitSlop = 6,
  ...restProps
}) => {
  const isControlled = typeof selected === "boolean";
  const [internalSelected, setInternalSelected] =
    useState(defaultSelected);

  const isSelected = isControlled ? selected : internalSelected;

  const handleToggle = () => {
    const next = !isSelected;
    if (!isControlled) setInternalSelected(next);
    onChange?.(next);
  };

  const containerTone = isSelected
    ? "bg-primary-main"
    : "bg-transparent";

  const textTone = isSelected
    ? "text-text-inverse font-pretendard-semibold"
    : "text-text-sub font-pretendard-regular";

  return (
    <Pressable
      {...restProps}
      onPress={handleToggle}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`h-11 w-20 flex-row items-center justify-start px-2 py-2.5 ${containerTone} ${className}`}
    >
      <Text
        numberOfLines={1}
        className={`text-14 ${textTone} ${textClassName}`}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default AreaParent;