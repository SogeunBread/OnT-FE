import { View } from "react-native";
import Button from "./Button";

const ButtonTwo = () => {
  return (
    <View className="w-96 h-24 border-t border-neutral-200">
      <View className="flex-row gap-4 px-4 py-2.5">
        <View className="w-28">
          <Button state="default" style="weak" text="이전" />
        </View>
        <View className="flex-1">
          <Button state="default" style="fill" text="다음" />
        </View>
      </View>
    </View>
  );
};
export default ButtonTwo;
