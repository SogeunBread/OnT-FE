import { colors } from "@/tailwind.config";
import { Pressable, Text, View } from "react-native";

const Radio = ({
  checked = false,
  onPress,
  disabled = false,
  label,
  className,
  ...props
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(!checked);
    }
  };

  const getBorderColor = () => {
    if (disabled) {
      return colors.grayscale.G200;
    }
    return checked ? colors.primary.main : colors.grayscale.G400;
  };

  const getBackgroundColor = () => {
    if (disabled) {
      return colors.grayscale.G200;
    }
    return checked ? colors.primary.main : "transparent";
  };

  const borderColor = getBorderColor();
  const backgroundColor = getBackgroundColor();

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPress={handlePress}
      className={`flex-row items-center gap-2 ${className}`}
    >
      <View
        className={`w-6 h-6 rounded-full items-center justify-center ${
          !checked ? "border" : ""
        }`}
        style={{
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {checked && (
          <View
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: colors.text.inverse,
            }}
          />
        )}
      </View>
      {label && (
        <Text
          className="text-14 font-pretendard-regular text-text"
          style={{
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default Radio;
