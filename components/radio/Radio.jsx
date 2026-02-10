import { colors } from "@/tailwind.config";
import { Pressable, View } from "react-native";

const Radio = ({
  checked = false,
  onPress,
  disabled = false,
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
  const borderWidth = checked ? 0 : 1;

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPress={handlePress}
      className={className}
    >
      <View
        className="rounded-full items-center justify-center"
        style={{
          width: 24,
          height: 24,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {checked && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.text.inverse,
            }}
          />
        )}
      </View>
    </Pressable>
  );
};

export default Radio;
