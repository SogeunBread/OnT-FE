import Avatar from "@/assets/figma/avatar-chat.svg";
import { Image, Pressable, Text, View } from "react-native";

export default function ChatList({
  name = "이름",
  message = "채팅 메시지",
  time = "00:00",
  unreadCount = 1,
  avatarSource,
  onPress,
  className = "",
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${message}${
        unreadCount > 0 ? `, 읽지 않은 메시지 ${unreadCount}개` : ""
      }`}
      onPress={onPress}
      className={`w-full flex-row items-center gap-3 border-b border-grayscale-G50 bg-white px-4 py-3 ${className}`}
    >
      {avatarSource ? (
        <Image
          source={
            typeof avatarSource === "string"
              ? { uri: avatarSource }
              : avatarSource
          }
          className="h-[52px] w-[52px] rounded-full"
        />
      ) : (
        <Avatar />
      )}
      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="text-14 font-pretendard-semibold text-text"
        >
          {name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-12 font-pretendard-regular text-grayscale-G700"
        >
          {message}
        </Text>
      </View>
      <View className="h-10 min-w-8 items-end gap-1">
        <Text className="text-12 font-pretendard-regular text-grayscale-G400">
          {time}
        </Text>
        {unreadCount > 0 && (
          <View className="min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-500 px-1">
            <Text className="text-[9px] leading-[13.5px] font-pretendard-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
