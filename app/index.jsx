import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false;
  const isTrainer = false;

  const entry = !isLoggedIn
    ? "/(userTabs)/home"
    : isTrainer
    ? "/(trainerTabs)/home"
    : "/(userTabs)/home";

  return <Redirect href={entry} />;
}
