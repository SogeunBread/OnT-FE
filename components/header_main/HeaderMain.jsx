import BellIcon from "@/components/icons/Bell";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGO_BOX_WIDTH = 46;

const HeaderMain = ({ isHome = false, menuName = "메뉴", onPressBell }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-b border-grayscale-G100 bg-white px-4"
      style={{ paddingTop: insets.top }}
    >
      <View className="h-[58px] flex-row items-center justify-between">
        {isHome ? (
          <View className="w-[46px] items-center justify-center bg-grayscale-G800 px-2 py-2">
            <Text className="text-12 font-pretendard-semibold text-white">
              로고
            </Text>
          </View>
        ) : (
          <Text
            className="text-18 font-pretendard-bold text-text"
            style={{ minWidth: LOGO_BOX_WIDTH }}
          >
            {menuName}
          </Text>
        )}

        <Pressable
          accessibilityLabel="알림"
          className="h-6 w-6 items-center justify-center"
          hitSlop={8}
          onPress={onPressBell}
        >
          <BellIcon />
        </Pressable>
      </View>
    </View>
  );
};

export default HeaderMain;
