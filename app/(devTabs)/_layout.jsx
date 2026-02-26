// app/(devTabs)/_layout.tsx
import NavigationBar from "@/components/navigation/NavigationBar";
import { Tabs } from "expo-router";

// 테스트 탭 아이콘은 임시로 아무거나
import ChatIcon from "@/components/icons/Chat";
import HomeIcon from "@/components/icons/Home";

export default function DevTabsLayout() {
  const devTabs = [
    { name: "index", label: "테스트1", Icon: HomeIcon },
    { name: "two", label: "테스트2", Icon: ChatIcon },
  ];

  return (
    <Tabs
      tabBar={(props) => <NavigationBar {...props} tabs={devTabs} />}
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      {devTabs.map(({ name }) => (
        <Tabs.Screen key={name} name={name} />
      ))}
    </Tabs>
  );
}
