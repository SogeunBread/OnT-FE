import { Pressable, Text } from "react-native";

const TabItem = ({ label, Icon, active, onPress, onLongPress }) => {
  const isActive = active === true;
  const iconColor = isActive ? "#FF795E" : "#A0A0A0";

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center py-2"
    >
      <Icon size={24} color={iconColor} />

      <Text
        className={`mt-1 text-12 font-pretendard-semibold ${
          isActive ? "text-primary-main" : "text-grayscale-G400"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default TabItem;
