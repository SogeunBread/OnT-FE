import { colors } from "@/tailwind.config";
import { Pressable, Text } from "react-native";

const ChipSquare = ({
  content = "chip",
  value,
  selected = false,
  onChange,
  className = "",
  ...props
}) => {
  const isSelected = selected === true;

  const handlePress = () => {
    onChange?.(value);
  };

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      className={`items-center justify-center rounded px-5 py-3 w-27 ${className}`}
      style={{
        borderWidth: 1,
        borderColor: isSelected ? colors.primary.main : colors.grayscale.G400,
        backgroundColor: isSelected ? colors.primary[50] : "transparent",
      }}
    >
      <Text
        className={`text-center text-14 ${
          isSelected ? "font-pretendard-semibold" : "font-pretendard-regular"
        }`}
        style={{
          color: isSelected ? colors.text.DEFAULT : colors.grayscale.G700,
        }}
      >
        {content}
      </Text>
    </Pressable>
  );
};

export default ChipSquare;
