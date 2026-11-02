import { useState } from "react";
import { Pressable, View } from "react-native";

export default function Toggle({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  accessibilityLabel = "설정 전환",
  className = "",
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const checked = value ?? internalValue;
  const toggle = () => {
    if (value === undefined) setInternalValue(!checked);
    onValueChange?.(!checked);
  };
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      aria-checked={checked}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={toggle}
      className={`h-7 w-[52px] justify-center rounded-full p-0.5 ${
        checked ? "bg-primary-main" : "bg-grayscale-G100"
      } ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <View
        className={`h-6 w-6 rounded-full bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] ${
          checked ? "self-end" : "self-start"
        }`}
      />
    </Pressable>
  );
}
