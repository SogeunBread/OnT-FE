import { colors } from "@/tailwind.config";
import { Pressable, Text } from "react-native";

const BUTTON_SMALL_STYLES = {
  default: {
    backgroundColor: colors.primary.main,
    textColor: colors.text.inverse,
    fontWeight: "400",
  },
  disabled: {
    backgroundColor: `${colors.grayscale.G100}80`,
    textColor: colors.grayscale.G300,
    fontWeight: "400",
    borderColor: colors.grayscale.G100,
  },
};

const ButtonSmall = ({ text = "button", disabled = false, ...props }) => {
  const currentStyle = disabled
    ? BUTTON_SMALL_STYLES.disabled
    : BUTTON_SMALL_STYLES.default;

  const { backgroundColor, textColor, fontWeight, borderColor } = currentStyle;

  return (
    <Pressable
      {...props}
      disabled={disabled}
      className="px-4 py-1.5 rounded-lg items-center justify-center"
      style={{
        backgroundColor: backgroundColor,
        borderWidth: disabled ? 1 : 0,
        borderColor: borderColor,
      }}
    >
      <Text
        className="text-14"
        style={{
          fontWeight: fontWeight,
          color: textColor,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default ButtonSmall;
