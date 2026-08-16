import { View } from "react-native";
import Button from "./Button";

const ButtonTwo = ({
  prevText = "이전",
  nextText = "다음",
  nextDisabled = false,
  onPrevPress,
  onNextPress,
}) => {
  return (
    <View className="w-full h-24 border-t border-neutral-200">
      <View className="flex-row gap-4 px-4 py-2.5">
        <View style={{ flex: 1 }}>
          <Button
            state="default"
            variant="weak"
            text={prevText}
            onPress={onPrevPress}
          />
        </View>

        <View style={{ flex: 2 }}>
          <Button
            state={nextDisabled ? "disabled" : "default"}
            variant={nextDisabled ? "disabled" : "fill"}
            disabled={nextDisabled}
            text={nextText}
            onPress={onNextPress}
          />
        </View>
      </View>
    </View>
  );
};

export default ButtonTwo;
