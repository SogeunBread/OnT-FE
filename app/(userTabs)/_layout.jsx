import HeaderMain from "@/components/header_main";
import NavigationBar from "@/components/navigation/NavigationBar";
import { userTabs } from "@/constants/userTabs";
import { Tabs } from "expo-router";

export default function UserTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => {
        const route = props.state.routes[props.state.index];
        return route.name === "meal-record" ? null : <NavigationBar {...props} tabs={userTabs} />;
      }}
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
      <Tabs.Screen
        name="meal-record"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
