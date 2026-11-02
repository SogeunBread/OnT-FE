import Right from "@/assets/figma/right.svg";
import Toggle from "@/components/toggle";
import { Pressable, Text, View } from "react-native";

export default function List({
  title = "메뉴명",
  subtitle = "메뉴 설명",
  variant = "default",
  value,
  defaultValue,
  onValueChange,
  onPress,
  disabled = false,
  className = "",
}) {
  const content = (
    <>
      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="text-14 font-pretendard-semibold text-text"
        >
          {title}
        </Text>
        {!!subtitle && (
          <Text
            numberOfLines={1}
            className="text-12 font-pretendard-regular text-grayscale-G600"
          >
            {subtitle}
          </Text>
        )}
      </View>
      {variant === "toggle" ? (
        <Toggle
          accessibilityLabel={title}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
        />
      ) : (
        <Right />
      )}
    </>
  );
  const classes = `w-full min-h-[63px] flex-row items-center gap-6 border-b border-grayscale-G100 bg-white px-4 py-3 ${
    disabled ? "opacity-50" : ""
  } ${className}`;
  return variant === "toggle" ? (
    <View className={classes}>{content}</View>
  ) : (
    <Pressable
      className={classes}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
}
