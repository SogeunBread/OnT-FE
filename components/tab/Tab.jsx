import { Pressable, Text } from "react-native";

const Tab = ({
  text = "메뉴",
  selected = false,
  disabled = false,
  onPress,
  className = "",
  textClassName = "",
  ...props
}) => {
  const textTone = selected ? "text-primary-main" : "text-grayscale-G600";
  const underlineTone = selected ? "border-primary-main" : "border-grayscale-G100";

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`items-center border-b-2 py-4 ${underlineTone} ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <Text
        className={`text-14 font-pretendard-semibold leading-[21px] ${textTone} ${textClassName}`}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default Tab;