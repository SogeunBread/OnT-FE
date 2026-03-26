import React from "react";
import { Text, View } from "react-native";
import Button from "@/components/button";

const Modal = ({
  title,
  content,
  showTitle = undefined,
  showContent = undefined,
  leftButtonText = "button",
  rightButtonText = "button",
  onLeftPress = () => {},
  onRightPress = () => {},
}) => {
  const hasTitle = typeof title === "string" && title.trim().length > 0;
  const hasContent = typeof content === "string" && content.trim().length > 0;
  const shouldShowTitle = showTitle ?? hasTitle;
  const shouldShowContent = showContent ?? hasContent;

  return (
    <View className="w-[358px] rounded-[12px] bg-white px-[12px] pt-[20px] pb-[12px] items-center gap-[16px]">
      {(shouldShowTitle || shouldShowContent) && (
        <View className="w-full items-center gap-[4px]">
          {shouldShowTitle && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="w-full text-center text-18 text-text font-pretendard-bold"
            >
              {title}
            </Text>
          )}
          {shouldShowContent && (
            <Text className="w-full text-center text-14 text-grayscale-G600 font-pretendard-regular">
              {content}
            </Text>
          )}
        </View>
      )}

      <View className="w-full flex-row gap-[8px]">
        <View className="flex-1">
          <Button text={leftButtonText} variant="weak" onPress={onLeftPress} />
        </View>
        <View className="flex-1">
          <Button
            text={rightButtonText}
            variant="fill"
            onPress={onRightPress}
          />
        </View>
      </View>
    </View>
  );
};

export default Modal;
