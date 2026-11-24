import { createContext, useContext } from "react";
import { useRouter } from "expo-router";
import { homeRoutes } from "./navigation";
export const HomeNavigationContext = createContext(null);
export function useHomeNavigation() {
  const router = useRouter();
  const override = useContext(HomeNavigationContext);
  const navigation = override ?? router;
  return { ...navigation, goBack: () => navigation.canGoBack() ? navigation.back() : navigation.replace(homeRoutes.home) };
}
