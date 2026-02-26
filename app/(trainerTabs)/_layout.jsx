import NavigationBar from "@/components/navigation/NavigationBar";
import { trainerTabs } from "@/constants/trainerTabs";
import { Tabs } from "expo-router";

export default function TrainerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <NavigationBar {...props} tabs={trainerTabs} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      {trainerTabs.map(({ name }) => (
        <Tabs.Screen key={name} name={name} />
      ))}
    </Tabs>
  );
}
