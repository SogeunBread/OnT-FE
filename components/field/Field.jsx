import Search from "@/assets/figma/search.svg";
import SearchFilled from "@/assets/figma/search-filled.svg";
import { colors } from "@/tailwind.config";
import { useState } from "react";
import { Platform, TextInput, View } from "react-native";

const Field = ({
  value,
  defaultValue = "",
  onChangeText,
  onFocus,
  onBlur,
  placeholder = "content",
  className = "",
  inputClassName = "",
  disabled = false,
  icon = false,
  state,
  style,
  ...restProps
}) => {
  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputValue = isControlled ? value : internalValue;
  const isDisabled = disabled || state === "disabled";
  const focused = !isDisabled && (isFocused || state === "typing");
  const SearchIcon = inputValue.length > 0 || focused ? SearchFilled : Search;
  return (
    <View
      className={`w-[358px] max-w-full min-h-11 flex-row items-center gap-3 rounded-lg border px-3 py-2.5 ${
        focused ? "border-primary-main" : "border-grayscale-G300"
      } ${isDisabled ? "bg-grayscale-G50" : "bg-white"} ${className}`}
    >
      {icon && <SearchIcon />}
      <TextInput
        {...restProps}
        value={inputValue}
        onChangeText={(text) => {
          if (!isControlled) setInternalValue(text);
          onChangeText?.(text);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        editable={!isDisabled}
        accessibilityState={{ disabled: isDisabled }}
        placeholder={placeholder}
        placeholderTextColor={
          isDisabled ? colors.grayscale.G400 : colors.grayscale.G500
        }
        className={`min-w-0 flex-1 text-14 font-pretendard-regular leading-[21px] ${
          isDisabled ? "text-grayscale-G400" : "text-text"
        } ${inputClassName}`}
        style={[
          {
            padding: 0,
            borderWidth: 0,
            ...(Platform.OS === "web" && {
              outlineStyle: "none",
              boxShadow: "none",
            }),
          },
          style,
        ]}
      />
    </View>
  );
};
export default Field;
