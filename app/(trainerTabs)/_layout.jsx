import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import { trainerTabs } from "@/constants/trainerTabs";
import { Tabs } from "expo-router";

export default function TrainerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavigationBar {...props} tabs={trainerTabs} />}
      screenOptions={{
        headerShown: true,
        header: ({ route }) => {
          const currentTab = trainerTabs.find((tab) => tab.name === route.name);

          return (
            <HeaderMain
              isHome={route.name === "home"}
              menuName={currentTab?.label ?? "메뉴"}
            />
          );
        },
        tabBarShowLabel: false,
      }}
    >
      {trainerTabs.map(({ name }) => (
        <Tabs.Screen key={name} name={name} />
      ))}
    </Tabs>
  );
}
