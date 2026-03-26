import { useState } from "react";
import { Pressable, Text } from "react-native";

const AreaChildBg = ({
  title = "title",
  selected,
  defaultSelected = false,
  onChange,
  className = "",
  titleClassName = "",
  hitSlop = 6,
  ...restProps
}) => {
  const isControlled = typeof selected === "boolean";
  const [internalSelected, setInternalSelected] = useState(defaultSelected);

  const isSelected = isControlled ? selected : internalSelected;

  const handleToggle = () => {
    const next = !isSelected;
    if (!isControlled) setInternalSelected(next);
    onChange?.(next);
  };

  const containerTone = isSelected ? "bg-primary-50" : "bg-transparent";
  const textTone = isSelected ? "text-primary-main" : "text-text-sub";
  const textWeight = isSelected
    ? "font-pretendard-semibold"
    : "font-pretendard-regular";

  return (
    <Pressable
      {...restProps}
      onPress={handleToggle}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`w-40 h-11 flex-row items-center justify-start px-2 py-2.5 ${containerTone} ${className}`}
    >
      <Text
        numberOfLines={1}
        className={`text-14 leading-5 ${textTone} ${textWeight} ${titleClassName}`}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default AreaChildBg;