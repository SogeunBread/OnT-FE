import Checkbox from "@/components/checkbox/Checkbox";
import { Pressable, Text, View } from "react-native";

const AreaCheck = ({
  label = "지역 이름",
  checked = false,
  onPress,
  className = "",
  labelClassName = "",
  ...props
}) => {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      className={`flex-row items-center gap-2 rounded-lg px-4 py-3 ${
        checked ? "bg-primary-50" : "bg-gray-100"
      } ${className}`}
    >
      <View pointerEvents="none">
        <Checkbox checked={checked} />
      </View>

      <Text
        className={`text-14 font-pretendard-medium ${
          checked ? "text-primary-main" : "text-text"
        } ${labelClassName}`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default AreaCheck;
