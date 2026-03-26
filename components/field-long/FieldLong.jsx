import { colors } from "@/tailwind.config";
import { useState } from "react";
import { Platform, TextInput, View } from "react-native";

const FieldLong = ({
  value,
  defaultValue = "",
  onChangeText,
  placeholder = "content",
  className = "",
  inputClassName = "",
  disabled = false,
  maxLength,
  ...restProps
}) => {
  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const inputValue = isControlled ? value : internalValue;
  const hasValue = inputValue.length > 0;

  const handleChangeText = (text) => {
    if (!isControlled) setInternalValue(text);
    onChangeText?.(text);
  };

  const borderTone = isFocused ? "border-primary-main" : "border-grayscale-G300";
  const textTone = isFocused || hasValue ? "text-text" : "text-grayscale-G500";

  return (
    <View
      className={`w-[358px] h-[125px] rounded-md border bg-white p-3 ${borderTone} ${className}`}
    >
      <TextInput
        {...restProps}
        multiline
        textAlignVertical="top"
        editable={!disabled}
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.grayscale.G500}
        maxLength={maxLength}
        className={`flex-1 text-14 font-pretendard-regular leading-5 ${textTone} ${inputClassName}`}
        style={{
          padding: 0,
          borderWidth: 0,
          ...(Platform.OS === "web" && {
            outlineStyle: "none",
            boxShadow: "none",
          }),
        }}
      />
    </View>
  );
};

export default FieldLong;