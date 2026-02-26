import CheckIcon from "@/components/icons/Check";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const CheckSquare = ({
  label = "",
  checked,
  defaultChecked = false,
  onChange,
  className = "",
  boxClassName = "",
  labelClassName = "",
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

  const boxTone = isChecked
    ? "border-primary-main bg-primary-main"
    : "border-grayscale-G200 bg-grayscale-G200";

  const labelTone = "text-text";

  return (
    <Pressable
      {...restProps}
      onPress={handleToggle}
      className={`flex-row items-center gap-2 self-start ${className}`}
      accessibilityRole="checkbox"
    >
      <View
        className={`size-[24px] items-center justify-center rounded-[20px] border ${boxTone} ${boxClassName}`}
      >
        <View className="relative">
          <CheckIcon size={16} color="white" />
        </View>
      </View>

      {label ? (
        <Text
          className={`text-14 font-pretendard-medium ${labelTone} ${labelClassName}`}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

export default CheckSquare;
