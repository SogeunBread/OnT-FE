import { Text, View } from "react-native";

const Tag = ({ text = "#근력증가", className = "" }) => {
  return (
    <View
      className={`bg-white border border-secondary-blue rounded-full px-2.5 py-1.5 self-start flex-row items-center justify-center ${className}`}
    >
      <Text className="text-12 font-pretendard-semibold text-secondary-blue">
        {text}
      </Text>
    </View>
  );
};

export default Tag;
