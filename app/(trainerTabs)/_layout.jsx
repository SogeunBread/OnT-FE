import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import { trainerTabs } from "@/constants/trainerTabs";
import { Tabs } from "expo-router";

export default function TrainerTabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      tabBar={(props) => (
        <NavigationBar {...props} tabs={trainerTabs} labelClassName="mt-2" />
      )}
      screenOptions={{
        headerShown: true,
        header: ({ route }) => {
          const currentTab = trainerTabs.find((tab) => tab.name === route.name);

          return (
            <HeaderMain
              isHome={route.name === "home"}
              menuName={currentTab?.label ?? "메뉴"}
              logoStyle={{ width: 37 }}
              className={route.name === "home" ? "border-grayscale-G50" : ""}
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
