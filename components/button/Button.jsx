import { colors } from "@/tailwind.config";
import { Pressable, Text } from "react-native";

const BUTTON_STYLES = {
  weak: {
    default: {
      backgroundColor: colors.primary[50],
      textColor: colors.primary.main,
      fontWeight: "600",
    },
    click: {
      backgroundColor: colors.primary[100],
      textColor: colors.primary.main,
      fontWeight: "600",
    },
  },
  fill: {
    default: {
      backgroundColor: colors.primary.main,
      textColor: colors.text.inverse,
      fontWeight: "600",
    },
    click: {
      backgroundColor: colors.primary[500],
      textColor: colors.text.inverse,
      fontWeight: "600",
    },
  },
  weakDark: {
    default: {
      backgroundColor: colors.grayscale.G100,
      textColor: colors.grayscale.G900,
      fontWeight: "600",
    },
    click: {
      backgroundColor: `${colors.grayscale.G100}80`,
      textColor: colors.grayscale.G900,
      fontWeight: "600",
    },
  },
  disabled: {
    disabled: {
      backgroundColor: colors.grayscale.G200,
      textColor: colors.grayscale.G500,
      fontWeight: "500",
    },
  },
};

const Button = ({
  text = "button",
  state = "default",
  variant = "weak",
  disabled = false,
  className = "",
  style,
  ...props
}) => {
  const currentState = disabled ? "disabled" : state;
  const currentVariant = typeof style === "string" ? style : variant;
  const pressableStyle = typeof style === "string" ? undefined : style;
  const currentStyle =
    BUTTON_STYLES[currentVariant]?.[currentState] ?? BUTTON_STYLES.weak.default;

  const { backgroundColor, textColor, fontWeight } = currentStyle;

  return (
    <Pressable
      {...props}
      disabled={disabled || state === "disabled"}
      className={`px-5 py-2.5 rounded-lg items-center justify-center ${className}`}
      style={[{ backgroundColor: backgroundColor }, pressableStyle]}
    >
      <Text
        className="text-16 font-pretendard-semibold"
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

export default Button;
