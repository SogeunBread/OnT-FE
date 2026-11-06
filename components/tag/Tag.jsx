import { Text, View } from "react-native";

const Tag = ({ text = "#근력증가", variant = "outline", className = "" }) => {
  const containerTone = variant === "filled"
    ? "bg-secondary-blueLight px-2 py-0.5"
    : "bg-white border border-secondary-blue px-2.5 py-1.5";

  return (
    <View
      className={`rounded-full self-start flex-row items-center justify-center ${containerTone} ${className}`}
    >
      <Text className="text-12 font-pretendard-semibold text-secondary-blue">
        {text}
      </Text>
    </View>
  );
};

export default Tag;
