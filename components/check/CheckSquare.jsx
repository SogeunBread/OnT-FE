import CheckIcon from "@/components/icons/Check";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const CHECK_SQUARE_STYLES = {
  checked: {
    box: "border-primary-main bg-primary-main",
    label: "text-text",
  },
  unchecked: {
    box: "border-grayscale-G200 bg-grayscale-G200",
    label: "text-text",
  },
  disabled: {
    box: "border-grayscale-G200 bg-grayscale-G100",
    label: "text-text-sub2",
    container: "opacity-60",
  },
};

const CheckSquare = ({
  label = "",
  checked,
  defaultChecked = false,
  onChange,
  className = "",
  boxClassName = "",
  labelClassName = "",
  disabled,
  ...restProps
}) => {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    const next = !isChecked;

    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  const currentState = disabled
    ? "disabled"
    : isChecked
    ? "checked"
    : "unchecked";
  const currentStyle = CHECK_SQUARE_STYLES[currentState];

  return (
    <Pressable
      {...restProps}
      onPress={handleToggle}
      className={`flex-row items-center gap-2 self-start ${
        currentStyle.container ?? ""
      } ${className}`}
      accessibilityRole="checkbox"
      disabled={disabled}
    >
      <View
        className={`size-[24px] items-center justify-center rounded-[4px] border ${currentStyle.box} ${boxClassName}`}
      >
        <View className="relative">
          <CheckIcon size={16} color="white" />
        </View>
      </View>

      {label ? (
        <Text
          className={`text-14 font-pretendard-medium ${currentStyle.label} ${labelClassName}`}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

export default CheckSquare;
