import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabItem from "./TabItem";

const NavigationBar = ({ state, navigation, tabs }) => {
  const insets = useSafeAreaInsets();
  const HOME_INDICATOR_HEIGHT = Math.max(insets.bottom, 34);
  const tabMap = Object.fromEntries(tabs.map((tab) => [tab.name, tab]));

  return (
    <View
      className="border-t border-grayscale-G100 bg-white"
      style={{ paddingBottom: HOME_INDICATOR_HEIGHT }}
    >
      <View className="flex-row">
        {state.routes.map((route, index) => {
          const tab = tabMap[route.name];
          if (!tab) return null;

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              label={tab.label}
              Icon={tab.Icon}
              active={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
};

export default NavigationBar;
