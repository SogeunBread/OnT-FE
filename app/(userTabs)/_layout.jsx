import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import { userTabs } from "@/constants/userTabs";
import { Tabs } from "expo-router";

export default function UserTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavigationBar {...props} tabs={userTabs} />}
      screenOptions={{
        headerShown: true,
        header: ({ route }) => {
          const currentTab = userTabs.find((tab) => tab.name === route.name);

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
      {userTabs.map(({ name }) => (
        <Tabs.Screen key={name} name={name} />
      ))}

      <Tabs.Screen
        name="trainer-matching"
        options={{
          href: null,
        }}
      />

      {/* 탭에 노출 안되는 화면이 user group에 있다면 */}
      {/* <Tabs.Screen name="something" options={{ href: null }} /> */}
    </Tabs>
  );
}
